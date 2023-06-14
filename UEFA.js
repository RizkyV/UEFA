function calculateCoefficients() {
    //@TODO IT RUNS 3 TIMES
    //@todo instead of one long fixture array, separate into 3 by league
    console.log('calculating');
    console.log(teams);
    console.log(countries);
    teams.forEach((team) => {
        var currentCountry = countries.find(element => element.name === team.team.country);
        if (team.team.id !== 327) {
            return;
        }
        var clubPoints = 0;
        var countryPoints = 0;
        console.log('team');
        console.log(team);

        seasons.forEach((season) => {
            console.log('season');
            console.log(season);
            var clubPointsSeason = 0;
            var countryPointsSeason = 0;
            //@todo find bonuses
            var bonuses = [
                { 'CLGS': false },
                { 'ELGS': false }
            ];
            season.fixtures.forEach((fixture) => {
                var points = ptsForFixture(team.team, fixture, bonuses);
                clubPointsSeason += points.clubPts;
                countryPointsSeason += points.countryPts;
            });


            if (bonuses.CLGS) {
                clubPointsSeason += 4;
            }

            console.log('clubPointsSeason');
            console.log(clubPointsSeason);
            clubPoints += clubPointsSeason;
            countryPoints += countryPointsSeason;
        });

        console.log('clubPoints');
        console.log(clubPoints);
        console.log('countryPoints');
        console.log(countryPoints);

        //@todo add entry into array with team, club points, season
        var teamIndex = teamsRanking.findIndex(element => element.team.team.id === team.team.id);
        if(teamsRanking[teamIndex]) {
            countriesRanking[teamIndex].points += clubPoints;
        } else {
            teamsRanking.push({'team': team, 'points': clubPoints});
        }

        //@todo add entry into array with country, country points, season
        var countryIndex = countriesRanking.findIndex(element => element.country.name === currentCountry.name);
        if(countriesRanking[countryIndex]) {
            countriesRanking[countryIndex].points += countryPoints;
        } else {
            countriesRanking.push({'country': currentCountry, 'points': countryPoints});
        }

        console.log(teamsRanking);
        console.log(countriesRanking);
    })
}

function ptsForFixture(team, fixture, bonuses) {
    var clubPts = 0;
    var countryPts = 0;
    if (isParticipant(team, fixture)) {
        console.log(fixture.league.name);
        console.log(fixture.league.round);
        console.log(fixture);
        console.log('participated');
        var clubPtsWin = 2;
        var clubPtsDraw = 1;
        var countryPtsWin = 2;
        var countryPtsDraw = 1;

        /*if(isFullPts(fixture)) {
            clubPtsWin = 2;
            clubPtsDraw = 1;

            countryPtsWin = 2;
            countryPtsDraw = 1;
        } else if(isHalfPts(fixture)) {
            ptsWin = 1;
            ptsDraw = 0.5;

            countryPtsWin = 1;
            countryPtsDraw = 0.5;
        } else if(isOnlyCountryPts(fixture)) {
            ptsWin = 0;
            ptsDraw = 0;

            countryPtsWin = 2;
            countryPtsDraw = 1;
        }*/

        if (isHome(team, fixture)) {
            if (fixture.teams.home.winner) {
                console.log('won');
                clubPts += clubPtsWin;
                countryPts += countryPtsWin;
            } else if (fixture.teams.home.winner === null) {
                console.log('drew');
                clubPts += clubPtsDraw;
                countryPts += countryPtsDraw;
            }
        } else {
            if (fixture.teams.away.winner) {
                console.log('won');
                clubPts += clubPtsWin;
                countryPts += countryPtsWin;
            } else if (fixture.teams.away.winner === null) {
                console.log('drew');
                clubPts += clubPtsDraw;
                countryPts += countryPtsDraw;
            }
        }
        console.log(clubPts);
        console.log(countryPts);
    }

    return {'clubPts': clubPts, 'countryPts': countryPts};
}


function isParticipant(team, fixture) {
    if (fixture.teams.home.id === team.id) {
        return true;
    } else if (fixture.teams.away.id === team.id) {
        return true;
    }

    return false;
}

function isHome(team, fixture) {
    if (fixture.teams.home.id === team.id) {
        return true;
    } else if (fixture.teams.away.id === team.id) {
        return false;
    }
}

function isFullPts(fixture) {
    //If is group stage onwards
    return false;
}

function isHalfPts(fixture) {
    switch(fixture.league.round) {
        case 'Preliminary Round':
        case '1st Qualifying Round':
            return true;
    }

    //If is qualifying
    return false;
}
function isOnlyCountryPts(fixture) {
    if(fixture.league.name === ECL || fixture.league.name === EL) {
        if(fixture.league.round === 'Knockout Round Playoffs') {
            return true;
        }
    }
    //If is knockout playoff round in el and ecl
    return false;
}

var CL = 'UEFA Champions League';
var EL = 'UEFA Europa League';
var ECL = 'UEFA Europa Conference League';
var countries = [];
var countriesRanking = [];
var teams = [];
var teamsRanking = []
var fixtures = [];
readLocal();
var seasons = [{ 'season': '2022', 'fixtures': [] }, { 'season': '2021', 'fixtures': [] }, { 'season': '2020', 'fixtures': [] }, { 'season': '2019', 'fixtures': [] }, { 'season': '2018', 'fixtures': [] }]
calculateCoefficients();

/**
 * TO DO:
 * 
 * foreach team
 * foreach season
 * foreach league
 * call fixtures/season/team/league
 * need to also calculate for countries at same time
 * Calculate bonuses?
 */

/**
 * LEAGUE IDS
 * CHAMPIONS LEAGUE - 2
 * EUROPA LEAGUE - 3
 * CONFERENCE LEAGUE - 848
 * 
 */


/**
 * COEFFICIENT POINTS
 * QUALIFYING MATCHES (ONLY FOR COUNTRY):
 * WIN - 1 PTS
 * DRAW - 0.5 PTS
 * 
 * GROUP STAGE ONWARDS:
 * WIN - 2 PTS
 * DRAW - 1 PTS
 * 
 * KNOCKOUT ROUND PLAY-OFFS AFTER EL AND ECL GS AND BEFORE R16 DO NOT COUNT FOR CLUB
 * 
 * BONUS:
 * REACHING QF (BUT NOT ECL), SF, F - 1 PTS
 * QUALIFY CL - 4 PTS
 * QUALIFY CL R16 - 5 PTS
 * QUALIFY EL R16 - 1 PTS
 * WIN EL GROUP - 4 PTS
 * RUNNER UP EL GROUP - 2 PTS
 * WIN ECL GROUP - 2 PTS
 * RUNNER UP ECL GROUP - 1 PTS
 * 
 * QUALIFYING POINTS IF ELIMINATED IN ECL QUALIFYING:
 * ECL-Q1 - 1 PTS
 * ECL-Q2 - 1.5 PTS
 * ECL-Q3 - 2 PTS
 * ECL-Q4 - 2.5 PTS
 * 
 * MINIMUM PTS FOR GROUP STAGES (IF CLUB SCORES LOWER THAN THIS, THEY GET ATLEAST THIS MUCH - IT IS NOT ADDED)
 * ECL - 2.5 PTS
 * EL - 3 PTS
 * 
 * 
 * COUNTRY COEFFICIENT = country pts/number of clubs rounded down to 3 digits
 * COUNTRY RANKING = sum of coefficients over last 5 years
 * 
 * CLUB RANKING = total points or (country rank / 5 rounded down to 3 digits), whichever is highest, 
 * 
 */