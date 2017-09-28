// rename to config.js

export const weatherApiKey = ''
export const weatherCityId = ''
export const hueUrl = ''

export const googleClientId = '' // create a google client ID in Google's developer
export const tasksApiKey = '' // create an API in google's Developer

// google calendars you want to red. Primary is the one you authenticate with. Any other is an emailadres
export const calendars = [
  'primary',
  'email@gmail.com'
]

export const todoLists = [{
  title: 'Boodschappen',
  id: '', /// list ID given by Google Tasks. In list.vue run getList and check your browser console
  quickAdd: [
    'Brood',
    'Melk',
    'Eten Jilles',
    'Luiers',
    'Kattenvoer',
    'Pindakaas',
    'WC papier'
  ]
}, {
  title: 'Todos',
  id: '', // list ID given by Google Tasks. In list.vue run getList and check your browser console
  quickAdd: [
    'Kapper bellen',
    'Mem bellen',
    'Gras maaien'
  ]
}]
