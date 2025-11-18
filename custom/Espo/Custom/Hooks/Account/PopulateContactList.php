<?php

namespace Espo\Custom\Hooks\Account;

use Espo\ORM\Entity;

class PopulateContactList
{
    public static $order = 100;

    protected $entityManager;

    public function __construct(\Espo\ORM\EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function afterSave(Entity $entity, array $options = [])
{
    if (!empty($options['skipHooks'])) return;

    $contacts = $entity->get('contacts'); // get related contacts

    if (empty($contacts)) {
        $entity->set('description', "No related contacts found.");
    } else {
        $text = "Related Contacts:\n\n";

        foreach ($contacts as $contact) {
            // $contact can be an ID or entity
            if (is_string($contact)) {
                $contact = $this->entityManager->getEntity('Contact', $contact);
            }
            $name = $contact->get('name');
            $text .= "• " . $name . "\n";
        }

        $entity->set('description', $text);
    }

    $this->entityManager->saveEntity($entity, ['skipHooks' => true]);
}

}
