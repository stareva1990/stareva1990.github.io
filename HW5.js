// const clientId = '3p72965ob8w4fqviim42cr21u8n67o';
// const clientSecret = 'jq37jggxa61vzkkesodnt8t3c6ddfb'
// const token ='t0e96l5d19iqqckxcqlur9jerpcllu'
// var aptUrl = 'https://api.twitch.tv/helix/streams';

let isLoading = false;
let paginations = '';

function getData(cb)
{
    const clientId = '3p72965ob8w4fqviim42cr21u8n67o';
    const token ='t0e96l5d19iqqckxcqlur9jerpcllu';
    const limit = 20;
    let api = `https://api.twitch.tv/helix/streams?game=League%20of%20Legends&first=${limit}&after=${paginations}`;

    const intro = new XMLHttpRequest();
    intro.open('GET', api)
    intro.setRequestHeader('Client-Id', clientId)
    intro.setRequestHeader('Authorization', 'Bearer ' + token)
    intro.send()
    intro.onload = function()
    {
        const results = JSON.parse(intro.response).data
        paginations = JSON.parse(intro.response).pagination.cursor
        // console.log(results)
        // console.log(paginations)
        cb(null, results)
    }
    

}
function appendData()
{
    getData((err, data) =>
    {
        const streams = data.streams;
        const $row = $('.channel');
        for (let streams of Object.keys(data))
        {
            var stream = data[streams];
            $row.append(getColumn(stream));
        }
        isLoading = false;
    });
}

function debounce(func, timeout = 300)
{
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const processChange = debounce(() => appendData());


$(document).ready(function()
{
    appendData();


    $(window).scroll(() =>
    {

        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200)
        {
            if (!isLoading)
            {
                processChange();
            }
        }


    });

})

function getColumn(data)
{
    const preview = data.thumbnail_url.replace('-{width}x{height}', '')

    return`
    <div class="wrap">
        <div class="screen">
            <img src="${preview}" alt="screen" onload="this.style.opacity=1">
        </div>
        <div class="info">
            <div class="channel-name">${data.title}</div>
            <div class="person-name">${data.user_name}</div>
        </div>
    </div>
    `
}