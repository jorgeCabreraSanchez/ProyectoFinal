'use strict';

module.exports = function(app) {
  var Contact = app.models.contact;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  Contact.count({}, function(err, count) {
        // A: The datastore produced an error! Pass error to callback
    if (err) throw err;

    if (count == 0) {
      Contact.create([
                {username: 'Jorge', email: 'jorge.cabrera.sanchez1@gmail.com', password: 'j12345', emailVerified: true},
                {username: 'Adolfo', email: 'adolfogarciaescobar@gmail.com', password: 'qwe123', emailVerified: true},
                {username: 'Antonio', email: 'patata@patata.com', password: 'j12345', emailVerified: true},
      ], function(err, contacts) {
        if (err) throw err;
        console.log('Created contacts:', contacts);
                // create the admin role
        Role.create({
          name: 'admin',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
                    // make Jorge an admin
          for (let i = 0; i <= 1; i++) {
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: contacts[i].id,
              roleId: role.id,
            }, function(err, principal) {
              if (err) throw err;
              console.log('Created principal:', principal);
            });
          }
        });
        Role.create({
          name: 'normal',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
          // make other contacts role normal
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: contacts[2].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log('Created principal', principal);
          });
        });
      });
    };
  });
};
