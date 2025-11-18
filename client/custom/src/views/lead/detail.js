define('custom:views/lead/detail', ['crm:views/lead/detail'], function (Dep) {

    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);

            this.dropdownItemList.push({
                name: 'findContacts',
                label: 'Find contacts'
            });
        },

        actionFindContacts: function () {
            var leadEmail = this.model.get('emailAddress');
            
            if (!leadEmail) {
                Espo.Ui.notify('No email address found', 'warning');
                return;
            }

            this.ajaxGetRequest('Contact', {
                where: [{
                    type: 'equals',
                    attribute: 'emailAddress', 
                    value: leadEmail
                }]
            }).then(function (data) {
                var contacts = data.list || [];
                var message = contacts.length === 0 ? 
                    'No contacts found with this email' :
                    'Found ' + contacts.length + ' contact(s)';
                    
                Espo.Ui.notify(message, contacts.length > 0 ? 'success' : 'warning', 3000);
            });
        }

    });

});