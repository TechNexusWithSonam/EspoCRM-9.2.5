define('custom:views/lead/record/detail', ['crm:views/lead/record/detail'], function (Dep) {

    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);

            if (!this.dropdownItemList) {
                this.dropdownItemList = [];
            }

            this.dropdownItemList.push({
                name: 'findContacts',
                label: 'Find contacts'
            });
        },

        actionFindContacts: function () {
            var leadEmail = this.model.get('emailAddress');
            console.log('Lead email:', leadEmail);

            if (!leadEmail) {
                Espo.Ui.notify('No email address found for this lead', 'warning');
                return;
            }

            Espo.Ui.notify('Searching for contacts...', 'info');

            var url = 'Contact?where[0][type]=equals&where[0][attribute]=emailAddress&where[0][value]=' + encodeURIComponent(leadEmail);
            
            Espo.Ajax.getRequest(url).then(function (data) {
                console.log('API Response:', data);
                var contacts = data.list || [];
                var message = '';

                if (contacts.length === 0) {
                    message = 'No contacts found with email address: ' + leadEmail;
                    Espo.Ui.notify(message, 'warning', 4000);
                } else {
                    message = 'Found ' + contacts.length + ' contact(s) with email ' + leadEmail + ':\n\n';
                    contacts.forEach(function(contact) {
                        message += '• ' + contact.name + '\n';
                    });
                    Espo.Ui.notify(message, 'success', 6000);
                }
            }.bind(this)).catch(function (xhr) {
                console.error('API Error:', xhr);
                Espo.Ui.notify('Error occurred while searching for contacts', 'error');
            });
        }

    });

});