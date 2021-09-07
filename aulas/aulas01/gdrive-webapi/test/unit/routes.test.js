import {
  describe,
  test,
  expect,
  jest
} from "@jest/globals";
import Routes from '../../src/routes.js';

describe('#Routes test suite', () => {
  const defaultParams = {
    request: {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: '',
      body: {}
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values(defaultParams)
  }

  describe('#setSocketInstance', () => {
    test('setSocket shoul store io instance', () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
      }

      routes.setSockeInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe('#handler', () => {
    test('givem am inexisten route it should choose default route', () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      }

      params.request.method = 'inexistent';
      routes.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith('Hello World');
    });

    test('it should set any requens with CORS enabled', () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      }

      params.request.method = 'inexistent';
      routes.handler(...params.values());
      expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    });

    test('givem method OPTION it shoul choose options route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      }

      params.request.method = 'OPTIONS';
      await routes.handler(...params.values());
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalledWith();
    });

    test('givem method POST it shoul choose post route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      }

      params.request.method = 'POST';
      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });

    test('givem method GET it shoul choose get route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      }

      params.request.method = 'GET';
      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe('#get', () => {
    test('given method GET it shuld list all files downloaded', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      }

      const fileStatusesMock = [
        {
          size: '54 kB',
          lastModified: '2021-09-07T14:39:11.313Z',
          owner: 'lucasfvidigal',
          file: 'file.txt'
        }
      ];

      jest.spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name)
        .mockResolvedValue(fileStatusesMock);

      params.request.method = 'GET';
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(fileStatusesMock));
    });
  });
});