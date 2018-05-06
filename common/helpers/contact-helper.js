'use strict';

module.exports = function HelperContact(Contact) {
  let Dropbox = require('dropbox').Dropbox;
  const multer = require('multer');
  let path = require('path');
  let http = require('http');
  let loopback = require('loopback');
  let dropboxConf = require('../../server/config').remoting.dropboxConf;
  let dbx = new Dropbox({accessToken: dropboxConf.accessToken});

  this.getRolesById = (id, next) => {
    Contact.findById(id, (err, persistedcontact) => {
      if (err) return next(new Error(err));
      let RoleMappingModel = Contact.app.models.RoleMapping;
      let RoleModel = Contact.app.models.Role;

      RoleMappingModel.findOne({where: {principalId: id}}, (err, role) => {
        if (err) return next(new Error(err));
        if (!role) { return next(new Error('No role found for this contact')); }

        RoleModel.findOne({where: {id: role.roleId}}, (err, contactRoles) => {
          if (err) return next(new Error(err));
          return next(null, contactRoles);
        });
      });
    });
  };

  this.uploadImage = function(ctx, req, res, userId, cb) {
    const storage = multer.memoryStorage();
    const cpUpload = multer({storage: storage}).array('file');

    cpUpload(req, res, () => {
      if (typeof req.file === 'undefined' && typeof req.files === 'undefined') {
        let err = new Error('No file sent, a file type parameter called `file` or `files` is required');
        err.status = 400;
        return cb(err);
      }

      const files = req.files ? req.files : req.file;

      dbx.filesUpload({path: `/${userId}-${Date.now()}.png`, contents: files[0].buffer, mode: 'overwrite'})
      .then(
        response => {
          console.log(response);
          createAndAssignSharedLink(response.name, userId, cb);
        })
      .catch(
        error => {
          console.log(error);
          return cb(error, 'No se ha podido subir la imagen');
        }
      );
      // Si quisieras poner varias imagenes dbx.FilesUploadSessionFinishBatchArg()
      // https://www.npmjs.com/package/dropbox Library
      // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUploadSessionFinish__anchor end-points
    });
    // cpUpload
  };
  // UploadImage

  function createAndAssignSharedLink(fileName, userId, cb) {
    dbx.sharingCreateSharedLinkWithSettings({path: `/${fileName}`,
      settings: {
        'requested_visibility': 'public',
      }})
    .then(
      newFile => {
        const url = newFile.url.substring(0, newFile.url.length - 1) + '1';

        Contact.findById(userId, function(context, contactInstance, next) {
          if (contactInstance.pathName) {
            dbx.filesDeleteV2({path: contactInstance.pathName}) // delete old patch
            .then(response => {
              contactInstance.patchAttributes({'image': url});
              contactInstance.patchAttributes({'pathName': newFile.path_lower}); // Change values in db new image before delete de older
              return cb('', 'Imagen añadida y borrada la antigua');
            })
            .catch(err => {
              return cb(new Error(err));
            });
          } else {
            contactInstance.patchAttributes({'image': url});
            contactInstance.patchAttributes({'pathName': newFile.path_lower});
            return cb('', 'Imagen añadida');
          }
        });
        // Take contact
      })
    .catch(
      error => {
        console.log(error);
        return cb(null, 'Image overwrite');
      }
    );
  }

  this.sendVerifyEmail = (contactInstance, next) => {
    console.log('> contact.afterRemote triggered');

    let options = {
      type: 'email',
      to: contactInstance.email,
      from: 'noreply@gnommostudios.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: 'http://localhost:4200',
      user: contactInstance,
      text: '{href}',
    };

    contactInstance.verify(options, function(err, response, cb) {
      if (err) return next(new Error(err));

      console.log('> verification email sent:', response);

      let RoleMappingModel = Contact.app.models.RoleMapping;
      let RoleModel = Contact.app.models.Role;

      RoleModel.findOne({where: {name: 'normal'}}, (err, role) => {
        if (err) return next(new Error(err));
        role.principals.create({
          principalType: RoleMappingModel.USER,
          principalId: contactInstance.id,
          roleId: role.id,
        }, function(err, principal) {
          if (err) return next(new Error(err));
          return next(null, response);
          console.log('Created principal:', principal);
        });
      });
      // Finish asing role
    });
    // finish verify
  };
  // Finish send verify email

  this.sendEmailPasswordReset = (contactInstance) => {
    var url = 'http://localhost:4200/new-password?access_token=' + contactInstance.accessToken.id;
    var myMessage = {text: url};

    // prepare a loopback template renderer
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/reset.ejs'));
    var htmlBody = renderer(myMessage);
    // 'here' in above html is linked to : 'http://<host:port>/reset-password?access_token=<short-lived/temporary access token>'
    Contact.app.models.Email.send({
      to: contactInstance.email,
      from: 'noreply@gnommostudios.com',
      subject: 'Password reset',
      html: htmlBody,
    }, function(err) {
      if (err) return console.log(err);
      console.log('> sending password reset email to:', contactInstance.email);
    });
  };
  // Finish send Email Password Reset

  this.deleteOnCascade = (ctx, next) => {
    let ContactBook = Contact.app.models.contactbook;
    const contactId = ctx.where.id.inq[0];

    ContactBook.find({
      'where': {
        'contactId': contactId,
      }},
    function(err, res) {
      if (err) return next(new Error(err));
      res.forEach(function(contactbookInstance) {
        ContactBook.deleteById(contactbookInstance.id, function() {
          console.log('Deleted contactBook', contactbookInstance.id);
        });
      });
      // Delete contactBook when this contact is in it

      let RoleMappingModel = Contact.app.models.RoleMapping;
      RoleMappingModel.findOne({where: {principalId: contactId}}, (err, roleMappingInstance) => {
        if (!roleMappingInstance) { return next(new Error('No role found for this contact')); }
        if (err) return next(new Error(err));
      
        roleMappingInstance.remove();
        // Delete RoleMapping

        dbx.filesDeleteV2({path: `/${contactId}.png`})
        .then(result => {
          return next(null, 'Imagen borrada' + roleMappingInstance);
        })
        .catch(error => {
          return next(error);
        });
        // Delete file from this contact
      });
      // Finish find roleMapping
    });
    // Find finish
  };
  // Finish delete cascade
};

