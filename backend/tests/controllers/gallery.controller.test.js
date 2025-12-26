jest.mock('../../models/gallery.model', () => {
  const GalleryMock = jest.fn().mockImplementation(function(data) {
    this._id = 'testGalleryId';
    this.name = data.name;
    this.galleryPicture = data.galleryPicture;
    this.galleryPictureType = data.galleryPictureType;
    this.createdAt = new Date('2023-01-01T00:00:00Z');
    this.save = jest.fn().mockResolvedValue(this);  
  });

  GalleryMock.find = jest.fn();
  GalleryMock.countDocuments = jest.fn();
  GalleryMock.findById = jest.fn();
  GalleryMock.findByIdAndDelete = jest.fn();
  return GalleryMock;
});


const { createGalleryPic, getGalleryPics, getGalleryPicImage, deleteGalleryPic } = require('../../controllers/gallery.controller');

describe('Gallery Controllers', () => {
  describe('createGalleryPic', () => {
    it('should respond with 400 if no file is provided', async () => {
      const req = { body: { name: 'NoFilePic' } , file: undefined };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createGalleryPic(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Picture is required." });
    });

    it('should save the picture and respond with 201 and JSON when file is provided', async () => {

      const fakeBuffer = Buffer.from('123');
      const req = { 
        body: { name: 'Test Pic' }, 
        file: { buffer: fakeBuffer, mimetype: 'image/png' } 
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createGalleryPic(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const jsonResponse = res.json.mock.calls[0][0];
      expect(jsonResponse.message).toBe("Gallery picture created successfully!");
      expect(jsonResponse.gallery).toBeDefined();
      expect(jsonResponse.gallery._id).toBe('testGalleryId');
      expect(jsonResponse.gallery.name).toBe('Test Pic');
      expect(jsonResponse.gallery.imageUrl).toBe('/gallery/pic/testGalleryId');
      expect(jsonResponse.gallery.createdAt).toBeDefined(); 
    });
  });

  describe('getGalleryPics', () => {
    it('should return paginated gallery items with imageUrl and pagination info', async () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const dummyItems = [
        { 
          _id: 'pic1', name: 'Pic1', createdAt: new Date('2023-01-01'),
          toObject: () => ({ _id: 'pic1', name: 'Pic1', createdAt: new Date('2023-01-01') })
        },
        { 
          _id: 'pic2', name: 'Pic2', createdAt: new Date('2023-01-02'),
          toObject: () => ({ _id: 'pic2', name: 'Pic2', createdAt: new Date('2023-01-02') })
        }
      ];
      
      const findChain = { 
        sort: jest.fn().mockReturnThis(), 
        skip: jest.fn().mockReturnThis(), 
        limit: jest.fn().mockResolvedValue(dummyItems) 
      };
      const Gallery = require('../../models/gallery.model'); 
      Gallery.find.mockReturnValue(findChain);
      Gallery.countDocuments.mockResolvedValue(dummyItems.length);

      await getGalleryPics(req, res);

      expect(Gallery.find).toHaveBeenCalledWith({}, { galleryPicture: 0 });
      expect(Gallery.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const data = res.json.mock.calls[0][0];
      expect(data.total).toBe(dummyItems.length);
      expect(data.page).toBe(1);     
      expect(data.limit).toBe(20);   
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items).toHaveLength(dummyItems.length);
      expect(data.items[0]).toMatchObject({ _id: 'pic1', name: 'Pic1', imageUrl: '/gallery/pic/pic1' });
      expect(data.items[1]).toMatchObject({ _id: 'pic2', name: 'Pic2', imageUrl: '/gallery/pic/pic2' });
    });
  });

  describe('getGalleryPicImage', () => {
    it('should send image buffer with correct headers if image is found', async () => {
      const imageBuffer = Buffer.from('dummy-image-data');
      const dummyPic = { galleryPictureType: 'image/png', galleryPicture: imageBuffer };
      const req = { params: { id: 'someId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), set: jest.fn() };
      const Gallery = require('../../models/gallery.model');
      Gallery.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(dummyPic) });

      await getGalleryPicImage(req, res);

      expect(Gallery.findById).toHaveBeenCalledWith('someId');
      expect(res.set).toHaveBeenCalledWith("Content-Type", "image/png");
      expect(res.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=3600");
      expect(res.send).toHaveBeenCalledWith(imageBuffer);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it('should respond 404 if image is not found', async () => {
      const req = { params: { id: 'nonexistentId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), set: jest.fn() };
      const Gallery = require('../../models/gallery.model');
      Gallery.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) }); 

      await getGalleryPicImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Not found");
    });
  });

  describe('deleteGalleryPic', () => {
    it('should delete picture and return success message if id exists', async () => {
      const req = { params: { id: 'deleteId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const Gallery = require('../../models/gallery.model');
      Gallery.findByIdAndDelete.mockResolvedValue({ _id: 'deleteId', name: 'Something' });  

      await deleteGalleryPic(req, res);

      expect(Gallery.findByIdAndDelete).toHaveBeenCalledWith('deleteId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Picture deleted successfully!" });
    });

    it('should respond 404 if picture id does not exist', async () => {
      const req = { params: { id: 'missingId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const Gallery = require('../../models/gallery.model');
      Gallery.findByIdAndDelete.mockResolvedValue(null);  

      await deleteGalleryPic(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Picture not found" });
    });
  });
});