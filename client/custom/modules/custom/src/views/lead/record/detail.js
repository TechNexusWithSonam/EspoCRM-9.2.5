define('custom:views/lead/record/detail', ['crm:views/lead/record/detail'], function (Dep) {

    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);

            this.addMenuItem('dropdown', {
                name: 'findContacts',
                label: 'Find contacts',
                action: 'findContacts'
            });
        },

        actionFindContacts: function () {
            Espo.Ui.notify(this.translate('Loading...'));

            Espo.Ajax.postRequest('Lead/action/findContacts', {
                id: this.model.id
            }).then(function (response) {
                Espo.Ui.notify(false);
                
                var contacts = response.contacts || [];
                var message = '';
                
                if (contacts.length === 0) {
                    message = 'No contacts found with matching email address.';
                } else {
                    message = 'Found ' + contacts.length + ' contact(s) with matching email address:\n\n';
                    contacts.forEach(function(contact) {
                        message += '• ' + contact.name + ' (' + contact.emailAddress + ')\n';
                    });
                }
                
                Espo.Ui.notify(message, 'success', 5000);
            }.bind(this)).catch(function () {
                Espo.Ui.notify('Error occurred while searching for contacts', 'error');
            });
        }

    });

});