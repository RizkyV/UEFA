function getLeagues() {
    fetcher('leagues?type=league&season=2023', (result) => {
        var div = document.getElementById('placeholder');
        result.response.forEach(league => {
            var p = document.createElement('p');
            p.innerHTML = league.country.name + ' - ' + league.league.name;
            div.appendChild(p);
        });
        var a = document.getElementById('download');
        var file = new Blob([JSON.stringify(result.response)], {type: 'json'});
        a.href = URL.createObjectURL(file);
    });
}

function getCountries() {
    fetcher('countries', (result) => {
        countries = result.response;
        var a = document.getElementById('download');
        var file = new Blob([JSON.stringify(result.response)], {type: 'json'});
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

function readLocal() {
    fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/countries.json")
        .then((res) => res.text())
        .then((result) => {
            var result = JSON.parse(result);
            countries = result;
            console.log(countries);
        })
        .catch((e) => console.error(e));

    fetch("https://raw.githubusercontent.com/RizkyV/UEFA/main/data/countrycoefficients.json")
        .then((res) => res.text())
        .then((result) => {
            var result = JSON.parse(result);
            console.log(result);
            result.response.forEach(entry => {
                var currentCountry = countries.find(element => element.code === entry.entry.country_code);
                currentCountry.ranking = entry.entry.ranking;
                countryRankings.push(currentCountry)
            });

            result.response.sort((a, b) => {
                console.log(a);
                console.log(b);
                console.log(parseInt(a.ranking) - parseInt(b.ranking));
                return parseInt(a.ranking) - parseInt(b.ranking);
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
        })
        .catch((e) => console.error(e));
}

var countries = [];
var countryRankings = [];
readLocal();

/**
 * TO DO:
 * 
 * upload countries to github, and read it in readlocal
 * make a ranking table
 * finish country coefficients
 * figure out a way of calculating coefficient?
 */