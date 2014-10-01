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