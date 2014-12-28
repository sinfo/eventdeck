var options = {};

options.statuses = {
  speaker: [
    { name: 'Selected', color: '#5319e7', default: true},
    { name: 'Approved', color: '#0052cc'},
    { name: 'Contacted', color: '#fbca04'},
    { name: 'In Conversations', color: '#207de5'},
    { name: 'Accepted', color: '#009800'},
    { name: 'Rejected', color: '#e11d21'},
    { name: 'Give Up', color: '#333'}
  ],
  company: [
    { name: 'Selected', color: '#5319e7', default: true},
    { name: 'Contacted', color: '#fbca04'},
    { name: 'In Conversations', color: '#207de5'},
    { name: 'In Negotiations', color: '#006b75'},
    { name: 'Closed Deal', color: '#009800'},
    { name: 'Rejected', color: '#e11d21'},
    { name: 'Give Up', color: '#333'}
  ],
  communication: [
    { name: 'Pending Review...', id: 'pending-review', color: '#fbca04' },
    { name: 'Reviewed.', id: 'reviewed', color: '#e11d21' },
    { name: 'Approved!', id: 'approved', color: '#009800' },
  ]
};

options.kinds = {
  communications: [
    'Email To',
    'Email From',
    'Meeting',
    'Phone Call'
  ],
  topics: [
    { name: 'IDEA', id:'idea', color: '#5319e7' },
    { name: 'INFO', id:'info', color: '#207de5' },
    { name: 'TODO', id:'todo', color: '#fbca04' },
    { name: 'DECISION', id:'decision', color: '#e11d21' },
    { name: 'MEETING', id:'meeting', color: '#333' },
  ],
  polls: [
    { name: 'Text', id:'text', color: '#207de5' },
    { name: 'Images', id:'images', color: '#5319e7' },
  ],
  sessions: [
    {id: 'keynote', name: 'Keynote', color:'#439BE8'},
    {id: 'meetup', name: 'Meetup', color: '#47F230'},
    {id: 'presentation', name: 'Presentation', color: '#5F4EF5'},
    {id: 'talk', name: 'Talk', color: '#FA8405'},
    {id: 'workshop', name: 'Workshop', color: '#F51414'}
  ]
};

options.roles = [
  { name: 'Public Relations', id: 'public-relations' },
  { name: 'Marketing', id: 'marketing' },
  { name: 'Internal Relations', id: 'internal-relations' },
  { name: 'Events', id: 'events' },
  { name: 'Innovation Awards', id: 'innovation-awards' },
  { name: 'Design', id: 'design' },
  { name: 'Audiovisuals', id: 'audiovisuals' },
  { name: 'Development Team', id: 'development-team' },
  { name: 'Coordination', id: 'coordination' },
  { name: 'Treasury', id: 'treasury' },
  { name: 'External Relations', id: 'external-relations' },
  { name: 'Strategic Partnerships', id: 'strategic-partnerships' },
  { name: 'Sys Admin', id: 'sys-admin' },
  { name: 'Marketing Manager', id: 'marketing-manager' }
];

module.exports = options;