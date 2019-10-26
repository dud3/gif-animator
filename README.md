# gif-animator
Simple script that animates on top of gif

# Usage
```
// Example entities
var e0 = {
    id: 'tag-0',
    value: '7',
    style: {
        left: 182,
        top: 122,
        'font-size': '20px',
        'color': '#000',
        'font-weight': 'bold'
    },
    showFrame: 1.2,
    delay: 1.5
};

var e1 = {
    id: 'tag-1',
    style: {
        left: 275,
        top: 250
    },
    showFrame: 5,
    delay: 5
};

var e2 = {
    id: 'tag-2',
    style: {
        left: 275,
        top: 350,
        'background-color': 'white',
        'color': '#000',
        'border-radius': '10px 10px'
    },
    showFrame: 3,
    delay: 10
};

// Generated Entities
var ge = [{value:"1","style":{"left":180,"top":122,"font-size":"20px","color":"#000","font-weight":"bold"},"showFrame":1.1,"delay":1.4},
{value:"2","style":{"left":180,"top":268,"font-size":"20px","color":"#000","font-weight":"bold"},"showFrame":8.09,"delay":1.4},
{value:"3","style":{"left":322,"top":196,"font-size":"20px","color":"#000","font-weight":"bold"},"showFrame":17.6,"delay":1.4},
{value:"4","style":{"left":317,"top":329,"font-size":"20px","color":"#000","font-weight":"bold"},"showFrame":27.8,"delay":1.4},
{value:"5","style":{"left":460,"top":268,"font-size":"20px","color":"#000","font-weight":"bold"},"showFrame":38.38,"delay":1.4},
{value:"6","style":{"left":402,"top":193,"font-size":"20px","color":"#000","font-weight":"bold"},"showFrame":43.32,"delay":1.4}];

// Class instance
var gif = new gif();
var gifBuilder = new gifBuilder(gif);

// Config
gif.main({
    src: _gif_src_ // replace me
    width: 500,
    height: 500,
    entities: ge,
    loop: {
        reloop: true,
        after: 46.67
    }
});

// window.location.protocol + '//' + window.location.host + '/teng-animation-stripped-optimized.gif',
```
