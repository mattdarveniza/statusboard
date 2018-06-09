# StatusBoard
A collection of components to render interesting real time data onto a status
board screen. Very much a work in progress.

Currently functional boards:
  * Timezone Clock
  * PTV Departures Board

Planned future boards:
  * Current/forecast weather
  * Weather radar
  * BuildKite bulid statuses
  * Bitbucket commit statistics
  * Jira burndown and in-progress tasks

## Running Statusboard
StatusBoard is a frontend-only [create-react-app](https://github.com/facebook/create-react-app)
based application. Follows all the standard CRA build and run tools, most
importantly:
  * `npm run start`
  * `npm run test`
  * `npm run build`

For the PTV board to work correctly, you'll need a developer ID and API key,
which you can apply for [here](https://www.ptv.vic.gov.au/about-ptv/data-and-reports/datasets/ptv-timetable-api/).
Add these into a `.env` file as `REACT_APP_PTV_DEV_ID` and
`REACT_APP_PTV_API_KEY`.