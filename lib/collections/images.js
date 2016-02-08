imageStore = new FS.Store.GridFS('images');
imageFileStore = new FS.Store.FileSystem('images-fs', {path: '/var/uploads'});

Images = new FS.Collection('images', {
  stores: [imageStore, imageFileStore]
});

Images.deny({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  },
  download: function () {
    return false;
  }
});

Images.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});
