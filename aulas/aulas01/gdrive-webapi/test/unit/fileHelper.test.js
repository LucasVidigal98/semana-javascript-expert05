import {
  describe,
  test,
  expect,
  jest
} from "@jest/globals";
import fs from 'fs';
import FileHelper from '../../src/fileHelper.js';

describe('#File Helper', () => {

  describe('#getFileStatus', () => {
    test('it should return files statuses in correct format', async () => {
      const statMock = {
        dev: 14,
        mode: 33279,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 512,
        ino: 5066549581876829,
        size: 54030,
        blocks: 112,
        atimeMs: 1631025635306.8247,
        mtimeMs: 1631025551312.69,
        ctimeMs: 1631025551312.69,
        birthtimeMs: 1631025551312.69,
        atime: '2021-09-07T14:40:35.307Z',
        mtime: '2021-09-07T14:39:11.313Z',
        ctime: '2021-09-07T14:39:11.313Z',
        birthtime: '2021-09-07T14:39:11.313Z'
      };

      const mockUser = 'lucasfvidigal';
      process.env.USER = mockUser;
      const fileName = 'file.png'

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([fileName]);

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFileStatus('/tmp');

      const expectedResult = [
        {
          size: '54 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: fileName
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${fileName}`);
      expect(result).toMatchObject(expectedResult);
    })
  })
})