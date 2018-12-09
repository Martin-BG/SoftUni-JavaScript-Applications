$(() => {
  const app = Sammy('#main', function () {
    this.use('Handlebars', 'hbs');

    this.get(/(\/index.html|#\/home)$/, viewHome);
    this.get('#/about', viewAbout);
    this.get('#/login', viewLogin);
    this.post('#/login', login);
    this.get('#/logout', logout);
    this.get('#/register', viewRegister);
    this.post('#/register', register);
    this.get('#/catalog', viewTeams);
    this.get('#/create', viewCreateTeam);
    this.post('#/create', createTeam);
    this.get('#/catalog/:id', viewTeam);
    this.get('#/leave', leaveTeam);
    this.get('#/join/:id', joinTeam);
    this.post('#/edit/:id', editTeam);
    this.get('#/edit/:id', viewEditTeam);

    const initAuthContext = (ctx) => {
      ctx.loggedIn = !!sessionStorage.getItem('authtoken');
      ctx.username = sessionStorage.getItem('username');
      ctx.teamId = sessionStorage.getItem('teamId');
      ctx.hasTeam = !!ctx.teamId;
    };

    function leaveTeam(ctx) {
      const teamId = sessionStorage.getItem('teamId');
      teamsService.leaveTeam()
        .then(function (response) {
          auth.saveSession(response);
          auth.showInfo('Team has been left');
          ctx.redirect(`#/catalog/${teamId}`);
        })
        .catch(auth.handleError);
    }

    function joinTeam(ctx) {
      const teamId = ctx.params.id;
      teamsService.joinTeam(teamId)
        .then((data) => {
          auth.saveSession(data);
          auth.showInfo('Team has been joined');
          ctx.redirect(`#/catalog/${teamId}`);
        })
        .catch(auth.handleError);
    }

    function editTeam(ctx) {
      const teamId = ctx.params.id;
      const teamName = ctx.params.name;
      const teamComment = ctx.params.comment;

      teamsService.edit(teamId, teamName, teamComment)
        .then(function () {
          auth.showInfo(`Team ${teamName} edited`);
          ctx.redirect(`#/catalog/${teamId}`);
        })
        .catch(auth.handleError);
    }

    function createTeam(ctx) {
      const teamName = ctx.params.name;
      const teamComment = ctx.params.comment;

      teamsService.createTeam(teamName, teamComment)
        .then(function (data) {
          teamsService.joinTeam(data._id)
            .then((newData) => {
              auth.saveSession(newData);
              auth.showInfo(`Successfully created team ${teamName}`);
              viewTeams(ctx);
            });
        });
    }

    function register(ctx) {
      const username = this.params.username;
      const password = this.params.password;
      const repeatPassword = this.params.repeatPassword;

      auth.register(username, password, repeatPassword)
        .then(function (userInfo) {
          auth.saveSession(userInfo);
          auth.showInfo(`Successfully registered ${username}`);
          viewHome(ctx);
        })
        .catch(auth.handleError);
    }

    function logout(ctx) {
      auth.logout()
        .then(function () {
          sessionStorage.clear();
          auth.showInfo('Logged out!');
          viewHome(ctx);
        })
        .catch(auth.handleError);
    }

    function login(ctx) {
      const username = this.params.username;
      const password = this.params.password;

      auth.login(username, password)
        .then(function (userInfo) {
          auth.saveSession(userInfo);
          auth.showInfo('Successfully logged in!');
          viewHome(ctx);
        })
        .catch(auth.handleError);
    }

    function viewEditTeam(ctx) {
      initAuthContext(ctx);
      ctx.teamId = ctx.params.id;
      teamsService.loadTeamDetails(ctx.teamId)
        .then(([teamInfo, users]) => {
          ctx.name = teamInfo.name;
          ctx.comment = teamInfo.comment;
          ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            editForm: './templates/edit/editForm.hbs'
          }).then(function () {
            this.partial('./templates/edit/editPage.hbs');
          });
        })
        .catch(auth.handleError);
    }

    function viewTeam(ctx) {
      const teamId = ctx.params.id;
      teamsService.loadTeamDetails(teamId)
        .then(function ([teamInfo, usersInfo]) {
          initAuthContext(ctx);
          ctx.name = teamInfo.name;
          ctx.comment = teamInfo.comment;
          ctx.members = usersInfo;
          ctx.teamId = teamInfo._id;
          ctx.isOnTeam = teamInfo._id === sessionStorage.getItem('teamId');
          ctx.isAuthor = teamInfo._acl.creator === sessionStorage.getItem('userId');
          ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            teamMember: './templates/catalog/teamMember.hbs',
            teamControls: './templates/catalog/teamControls.hbs'
          }).then(function () {
            this.partial('./templates/catalog/details.hbs');
          });
        })
        .catch(auth.handleError);
    }

    function viewCreateTeam(ctx) {
      initAuthContext(ctx);
      ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        createForm: './templates/create/createForm.hbs'
      }).then(function () {
        this.partial('./templates/create/createPage.hbs');
      });
    }

    function viewRegister(ctx) {
      initAuthContext(ctx);
      ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        registerForm: './templates/register/registerForm.hbs'
      }).then(function () {
        this.partial('./templates/register/registerPage.hbs');
      });
    }

    function viewLogin(ctx) {
      initAuthContext(ctx);
      ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        loginForm: './templates/login/loginForm.hbs'
      }).then(function () {
        this.partial('./templates/login/loginPage.hbs');
      });
    }

    function viewAbout(ctx) {
      initAuthContext(ctx);
      ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
      }).then(function () {
        this.partial('./templates/about/about.hbs');
      });
    }

    function viewHome(ctx) {
      initAuthContext(ctx);
      ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
      }).then(function () {
        this.partial('./templates/home/home.hbs');
      });
    }

    function viewTeams(ctx) {
      teamsService.loadTeams()
        .then(function (data) {
          initAuthContext(ctx);
          ctx.hasNoTeam = !ctx.hasTeam;
          ctx.teams = data;
          ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            team: './templates/catalog/team.hbs'
          }).then(function () {
            this.partial('./templates/catalog/teamCatalog.hbs');
          });
        });
    }
  });

  app.run();
});
