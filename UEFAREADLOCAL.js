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
                                    console.log(fixtures);

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

function getLeagues() {
    var text = '';
    fetcher('fixtures/rounds?league=2&season=2022', (result) => {

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