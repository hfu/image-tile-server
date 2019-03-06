# image-tile-server
a simple image tile server that uses mapbox-gl-native

# install
```console
git clone git@github.com:hfu/image-tile-server
git clone git@github.com:hfu/onyx-tapioca
cd image-tile-server
npm install
```

# use
```console
node index.js
```

# see also
This work is inspired by [apkoponen/mapbox-gl-native-server-example](https://github.com/apkoponen/mapbox-gl-native-server-example).

# note
You need to think about adding offset and then cut it, or even introducing metatile. See also index.js of [image-tiles-512](https://github.com/hfu/image-tiles-512).

