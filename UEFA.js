function getLeagues() {
    var text = '';
    fetcher('fixtures?season=2022&league=3', (result) => {

        var a = document.getElementById('download');
        var file = new Blob([JSON.stringify(result.response)], { type: 'json' });
        a.href = URL.createObjectURL(file);
    });

}

function getCountries() {
    fetcher('countries', (result) => {
        countries = result.response;
        var a = document.getElementById('download');
        var file = new Blob([JSON.stringify(result.response)], { type: 'json' });
        a.href = URL.createObjectURL(file);
    });
}

function fetcher(endpoint, test) {
    var myHeaders = new Headers();
    myHeaders.append("x-apisports-key", "1c7ba15bfac7680dd1bbca1051ddf930");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch('https://v3.football.api-sports.io/' + endpoint, requestOptions)
        .then(response => response.text())
        .then(result => {
            var result = JSON.parse(result);
            console.log(result);
            test(result);
        })
        .catch(error => console.log('error', error));
}

function fillFrontend() {
    var div = document.getElementById('placeholder');
    result.response.forEach(league => {
        var p = document.createElement('p');
        p.innerHTML = league.country.name + ' - ' + league.league.name;
        div.appendChild(p);
    });

    countryRankings.sort((a, b) => {
        return parseInt(b.ranking) - parseInt(a.ranking);
    });

    var table = document.getElementById('countryranking');
    countryRankings.forEach((country) => {
        var tr = document.createElement('tr');
        var tdName = document.createElement('td');
        var tdRanking = document.createElement('td');
        tdName.innerHTML = country.name;
        tdRanking.innerHTML = country.ranking;
        tr.appendChild(tdName);
        tr.appendChild(tdRanking);
        table.appendChild(tr);

    });
}

function readLocal() {
    fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/countries.json")
        .then((res) => res.text())
        .then((result) => {
            var result = JSON.parse(result);
            countries = result;
            console.log(countries);

            fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/teams-season=2022-league=2.json")
                .then((res) => res.text())
                .then((result) => {
                    var result = JSON.parse(result);
                    result.forEach((team) => {
                        teams.push(team);
                    })
                    console.log(result);

                })
                .catch((e) => console.error(e));

            fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/teams-season=2022-league=3.json")
                .then((res) => res.text())
                .then((result) => {
                    var result = JSON.parse(result);
                    result.forEach((team) => {
                        teams.push(team);
                    })
                    console.log(result);

                })
                .catch((e) => console.error(e));

            fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/teams-season=2022-league=848.json")
                .then((res) => res.text())
                .then((result) => {
                    var result = JSON.parse(result);
                    result.forEach((team) => {
                        teams.push(team);
                    })
                    console.log(result);
                })
                .catch((e) => console.error(e));


            fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/fixtures-season=2022-league=2.json")
                .then((res) => res.text())
                .then((result) => {
                    var result = JSON.parse(result);
                    result.forEach((fixture) => {
                        fixtures.push(fixture);
                    })
                    console.log(result);

                    fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/fixtures-season=2022-league=3.json")
                        .then((res) => res.text())
                        .then((result) => {
                            var result = JSON.parse(result);
                            result.forEach((fixture) => {
                                fixtures.push(fixture);
                            })
                            console.log(result);

                            fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/fixtures-season=2022-league=848.json")
                                .then((res) => res.text())
                                .then((result) => {
                                    var result = JSON.parse(result);
                                    result.forEach((fixture) => {
                                        fixtures.push(fixture);
                                    })
                                    console.log(result);

                                    seasons.find(element => element.season = '2022').fixtures = fixtures;
                                    calculateCoefficients();
                                })
                                .catch((e) => console.error(e));

                        })
                        .catch((e) => console.error(e));

                })
                .catch((e) => console.error(e));




        })
        .catch((e) => console.error(e));


}

function calculateCoefficients() {
    //@todo instead of one long fixture array, separate into 3 by league
    console.log('calculating');
    console.log(teams);
    teams.forEach((team) => {
        if (team.team.id !== 40) {
            return;
        }
        var clubPoints = 0;
        console.log(team);

        seasons.forEach((season) => {
            console.log(season);
            var clubPointsSeason = 0;
            var countryPointsSeason = 0;
            var bonuses = [{ 'CLGS': false }, { 'ELGS': false }];
            season.fixtures.forEach((fixture) => {
                console.log(fixture.league.name);
                console.log(fixture.league.round);
                console.log(fixture);
                clubPointsSeason += ptsForFixture(team.team, fixture, bonuses);
                console.log(clubPointsSeason);
            });


            if (bonuses.CLGS) {
                clubPointsSeason += 4;
            }

            console.log('clubPointsSeason');
            console.log(clubPointsSeason);
            clubPoints += clubPointsSeason;
        });
        console.log('clubPoints');
        console.log(clubPoints);
    })
}

function ptsForFixture(team, fixture, bonuses) {
    var CL = 'UEFA Champions League';
    var ECL = 'UEFA Europa Conference League';

    var pts = 0;
    if (isParticipant(team, fixture)) {
        console.log('participated');
        if (fixture.league.name === CL) {
            if (isHome(team, fixture)) {
                if (fixture.teams.home.winner) {
                    console.log('won');
                    pts += 2;
                } else if (fixture.teams.home.winner === null) {
                    console.log('drew');
                    pts += 1;
                }
            } else {
                if (fixture.teams.away.winner) {
                    console.log('won');
                    pts += 2;
                } else if (fixture.teams.away.winner === null) {
                    console.log('drew');
                    pts += 1;
                }
            }
        }
        console.log(pts);
    }

    return pts;
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

var countries = [];
var countryRankings = [];
var teams = [];
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