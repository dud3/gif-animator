# gif-animator
Simple script that animates on top of gif

# Usage
```
// Entities
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
    src: window.location.protocol + '//' + window.location.host + '/teng-animation-stripped-optimized.gif',
    width: 500,
    height: 500,
    entities: ge,
    loop: {
        reloop: true,
        after: 46.67
    }
});
```
