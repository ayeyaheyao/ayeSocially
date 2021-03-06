import {Parties} from '../../../both/collections/parties.collection';
import {Meteor} from 'meteor/meteor';
import {Counts} from 'meteor/tmeasday:publish-counts';

function buildQuery(partyId?: string): Object {
    const isAvailable = {
        $or: [
            {'public': true}, 
            {
                $and: [
                    {owner: this.userId},
                    {owner: {$exists: true}}
                ]
            }
        ]
    };

    if (partyId) {
        return {$and: [{_id: partyId}, isAvailable]};
    }

    return isAvailable;
}

Meteor.publish('parties', function(options: any) {
    Counts.publish(this, 'numberOfParties', Parties.find(buildQuery.call(this)), { noReady: true });

    return Parties.find(buildQuery.call(this), options);
});

Meteor.publish('party', function(partyId: string) {    
    return Parties.find(buildQuery.call(this, partyId));
});