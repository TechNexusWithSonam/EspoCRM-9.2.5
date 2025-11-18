define('custom:views/account/detail', ['crm:views/account/detail'], function (Dep) {

    return Dep.extend({

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.updateContactsDescription();
        },

        updateContactsDescription: function () {
            var accountId = this.model.id;
            
            this.ajaxGetRequest('Contact', {
                where: [
                    {
                        type: 'equals',
                        attribute: 'accountId',
                        value: accountId
                    }
                ]
            }).then(function (data) {
                var contacts = data.list || [];
                var description = 'Related Contacts:\n\n';
                
                if (contacts.length > 0) {
                    contacts.forEach(function(contact) {
                        description += '• ' + contact.name + '\n';
                    });
                } else {
                    description = 'No related contacts found.';
                }
                
                this.model.set('description', description);
                this.reRender();
            }.bind(this));
        }

    });

});