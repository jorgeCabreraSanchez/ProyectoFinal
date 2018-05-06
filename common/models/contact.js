'use strict';

module.exports = function(Contact) {
  const fs = require('fs');
  const HelperContact = require('../helpers/contact-helper');
  require('isomorphic-fetch'); // or another library of choice.
  // Contact.validatesUniquenessOf('username');
  // var passwordFormat = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,16})$/;
   // Contact.validatesFormatOf('password', { with: passwordFormat, message: 'Must provide a valid password' });;
  var phoneFormat = /^(\+34|0034|34)?[6|7|9][0-9]{8}$/;
  Contact.validatesFormatOf('phone', {with: phoneFormat, message: 'Must provide a valid phone'});
  Contact.validatesLengthOf('password', {min: 6, message: {min: 'Password is too short'}});
  Contact.validatesLengthOf('name', {min: 3, message: {min: 'Name is too short'}, allowBlank: true, allowNull: true});
  // Contact.validatesLengthOf('surname', {min: 3, message: {min: 'Surname is too short'}});
  // var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  // Contact.validatesFormatOf('email', {with: re, message: 'Must provide a valid email'});

  // Contact.validatesUniquenessOf('name');
  const helperContact = new HelperContact(Contact);

  Contact.on('resetPasswordRequest', function(contactInstance) {
    helperContact.sendEmailPasswordReset(contactInstance);
  });

  Contact.afterRemote('login', function(ctx, result, next) {    
    let token = Contact.app.models.accessToken;
    ctx.result.ttl = 1200000;
    ctx.result.save(next);    
  });

  Contact.observe('after delete', function(ctx, next) {
    helperContact.deleteOnCascade(ctx, next); // Delete contactBook when this contact is in it
  });

  // send verification email after registration
  Contact.afterRemote('create', function(context, contactInstance, next) {
    helperContact.sendVerifyEmail(contactInstance, next); // send verify email and asign role 'normal'
  });

  Contact.uploadImage = helperContact.uploadImage;

  Contact.remoteMethod('uploadImage', {
    
    http: {verb: 'post'},

    http: {path: '/:id/upload-image'},

    accepts: [{arg: 'ctx', type: 'object', http: {source: 'context'}},
    {arg: 'req', type: 'object', http: {source: 'req'}},
    {arg: 'res', type: 'object', http: {source: 'res'}},
    {arg: 'id', type: 'string', http: {source: 'path'}},
    ],
    
    returns: {arg: 'fileRute', type: 'string', root: true},
  });

  Contact.getRolesById = helperContact.getRolesById;

  Contact.remoteMethod('getRolesById', {

    http: {verb: 'get'},

    http: {path: '/:id/get-roles-by-id'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });
};

