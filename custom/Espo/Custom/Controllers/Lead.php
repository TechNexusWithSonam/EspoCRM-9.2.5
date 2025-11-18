<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Record;
use Espo\Core\Api\Request;
use Espo\Core\Exceptions\BadRequest;

class Lead extends Record
{
    public function postActionFindContacts(Request $request)
    {
        $data = $request->getParsedBody();
        $id = isset($data->id) ? $data->id : null;

        if (!$id) {
            throw new BadRequest();
        }

        $lead = $this->getRecordService()->getEntity($id);
        
        if (!$lead) {
            throw new BadRequest('Lead not found');
        }

        $emailAddress = $lead->get('emailAddress');
        
        if (!$emailAddress) {
            return ['contacts' => []];
        }

        $entityManager = $this->getEntityManager();
        
        $contacts = $entityManager->getRepository('Contact')
            ->where([
                'emailAddress' => $emailAddress
            ])
            ->find();

        $result = [];
        foreach ($contacts as $contact) {
            $result[] = [
                'id' => $contact->getId(),
                'name' => $contact->get('name'),
                'emailAddress' => $contact->get('emailAddress')
            ];
        }

        return ['contacts' => $result];
    }
}