
# jQuery.fn.comments() For Finding Comments In The DOM

by [Ben Nadel][1] (on [Google+][2])

The jQuery.fn.comments() method provides a way to search the Document Object Model (DOM)
for the existence of comments. The method can be called with a variety of signatures:

* .comments() - Get all comments in the given node, using a __shallow search__.
* .comments( true ) - Get all the comments in the given node, using a __deep search__.
* .comments( value ) - Get all the comments in the given node that _exactly_ match the given value, using a __shallow search__.
* .comments( value, true ) - Get all the comments in the given node that _exactly_ match the given value, using a __deep search__.
* .comments( name, value ) - Get all the comments in the given node that contain the given _pseudo attribute_ pair, using a __shallow search__.
* .comments( name, value, true ) - Get all the comments in the given node that contain the given _pseudo attribute_ pair, using a __deep search__.

The last two take signatures take a name and a value and then try to locate comments based
on the given _pseudo attribute_. Since comment nodes don't really have attributes, the 
jQuery plugin will look for constructs that look like normal element attributes. In the 
following comment, there are _3 attributes_:

```html
<!-- id=34 name="Ben" deactivated -->
```

Behind the scenes, this results in the following attributes:

* id: "34"
* name: "Ben"
* deactivated: ""

Because the comments() method can have multiple signatures, it may get confused if your
"value" parameter is a Boolean. When in doubt, pass the "value" in as a String.


[1]: http://www.bennadel.com
[2]: https://plus.google.com/108976367067760160494?rel=author