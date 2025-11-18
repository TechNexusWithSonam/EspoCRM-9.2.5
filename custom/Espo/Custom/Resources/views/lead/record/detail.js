define('custom:views/lead/record/detail', ['crm:views/lead/record/detail'], function (Dep) {

    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);

            // Initialize dropdown list if not exists
            if (!this.dropdownItemList) {
                this.dropdownItemList = [];
            }

            // Add dropdown item
            this.dropdownItemList.push({
                name: 'findContacts',
                label: 'Find contacts'
            });

            console.log('Lead dropdown items:', this.dropdownItemList);
        },

        // Action triggered when dropdown item is clicked
        actionFindContacts: function () {
            var leadEmail = this.model.get('emailAddress');

            if (!leadEmail) {
                Espo.Ui.notify('No email address found for this lead', 'warning');
                return;
            }

            Espo.Ui.notify('Searching for contacts...', 'info');

            var self = this;

            this.ajaxGetRequest('Contact', {
                where: [  // changed from filter to where
                    { type: 'equals', attribute: 'emailAddress', value: leadEmail }
                ]
            }).then(function (data) {
                var contacts = data.list || [];
                var message = '';

                if (contacts.length === 0) {
                    message = 'No contacts found with email: ' + leadEmail;
                    Espo.Ui.notify(message, 'warning', 3000);
                } else {
                    message = 'Found ' + contacts.length + ' contact(s):<br>';
                    contacts.forEach(function(contact) {
                        message += '• <a href="#Contact/' + contact.id + '">' + contact.name + '</a><br>';
                    });
                    Espo.Ui.notify(message, 'success', 5000, { allowHtml: true });
                }
            }).catch(function () {
                Espo.Ui.notify('Error searching contacts', 'error');
            });
        }

    });

});
