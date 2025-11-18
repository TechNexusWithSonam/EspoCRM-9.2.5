<?php

namespace Espo\Custom\SelectManagers;

class Contact extends \Espo\SelectManagers\Base
{
    protected function boolFilterHasPhoneNumber(&$result)
    {
        $result['whereClause'][] = [
            'id=s' => [
                'from' => 'ContactPhoneNumber',
                'select' => ['contactId'],
                'whereClause' => [
                    'deleted' => false
                ]
            ]
        ];
    }
}