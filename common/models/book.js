'use strict';

module.exports = function(Book) {
  Book.observe('after delete', function(ctx, next) {
    var ContactBook = Book.app.models.contactbook;
    ContactBook.find({
      'where': {
        'bookId': ctx.where.id,
      }}, function(err, res) {
      res.forEach(function(contactbookInstance) {
        ContactBook.deleteById(contactbookInstance.id, function() {
          console.log('Deleted contactBook', contactbookInstance.id);
        });
      });
      next(err, res);
    });
  });
};
