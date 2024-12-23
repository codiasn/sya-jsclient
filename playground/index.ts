import { Xya } from "xya-jsclient";

async function bootstrap() {
  const xya = new Xya({
    onError(error) {
      console.log(error);
    },
    lang: "es",
    sessionId: "910abb42-e792-431f-b2ef-fd9f94e118b7",
    rsa: {
      public: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmpoShmPBV3G3kLKmNW2D
F0Zk4dvZ3cglANPcPEpD8FUlsETgQ8U9EfCCDTKgcNQGHbEB6zvjpkxtfNAeWM1C
CqTgmEmLcZoaC0misw7efl+xzeN49fSs+0cotU/D4taaCz59Yoy08D1O5k7UADKa
PilXq8ugJdwydNJZCWixjYDLi87uaRRB79AvLYjY8hHcw2y7zTwzr3C5GvmhcFWc
kNmTLEP7UG9Hmay8PsGHvHBDStyoGzFLSnaNNnprDVflXLynkuWpilh008jv1+Et
6xY9D53SBxmXKdprMVZmBhdY1G7WEn0VdDUHi1yaMU9jY9aObmu8Rbl1yGaoSeUm
xwIDAQAB
-----END PUBLIC KEY-----`,
      private: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAmpoShmPBV3G3kLKmNW2DF0Zk4dvZ3cglANPcPEpD8FUlsETg
Q8U9EfCCDTKgcNQGHbEB6zvjpkxtfNAeWM1CCqTgmEmLcZoaC0misw7efl+xzeN4
9fSs+0cotU/D4taaCz59Yoy08D1O5k7UADKaPilXq8ugJdwydNJZCWixjYDLi87u
aRRB79AvLYjY8hHcw2y7zTwzr3C5GvmhcFWckNmTLEP7UG9Hmay8PsGHvHBDStyo
GzFLSnaNNnprDVflXLynkuWpilh008jv1+Et6xY9D53SBxmXKdprMVZmBhdY1G7W
En0VdDUHi1yaMU9jY9aObmu8Rbl1yGaoSeUmxwIDAQABAoIBABJokRcebqmWWUip
9P98nDTbxWxdTLpLOBi6oUkugJtv0A6GjPuU0zo9HIcsxYzZuiaz6moTlf45sHnB
oDNrsVbqHfIUI73xnvNEH9LZTOXYSCgfU0paCXTcGr1IE6eBbRM0rCJdZbgLXMcw
kK67V8FaE93ZX6bSatGdMEveAvI5udIjZ/m/WnhXIvDY2yai5ehemNjv9VevivAB
DrocKBfsijldBUGU562KvhihD7NE/kYqrha9iv2lXmD5rlyDx12VsSNmplrs7IFN
SIf1htK+b9r4LJcKOG0aiH+Wk2uarzXqPR/Gx3Mo6m6LrJsfDlWXZuqdxLiC8lzu
/olNzFUCgYEA0YB05RXYFY4v+uU9vDZrU2q1ReqKVODri+jI/51EMPbWvzN0P+Mt
TiGL1T9oMly9L14UWYy22ZSCWnoo8IcAB/Uo3ooPNpoAWJPZdPfDMMFpdKAhfUQC
21C6vpT9fETvwTWA48ifyx3BEVHDiBBFF5j36JOTHxB/4wofh7irpY0CgYEAvOpK
3Cm1YjWUnVO7nqkdGF77fhos/2k0CzUs6uCjFnfKTHy3LE7kApt+61DM8lrnTaAE
tdkj1E1oDRAzYnjBzHcCscF5w6N8yhzwSgk8wGGVeJ8/+58oAdQjefRhFNr8XD0z
4xlU1/qNTSD5RNIaquhz6fm6C2CBs2v5CLUrNqMCgYAzNgddCF3txvgLiIXywAq0
NV1iXda6sNBjPuADO9ozbeNIkbdU9p9YffLEid9akDjen0yyJyd7QEYs/7eKNDXZ
vB/lZjIZ0sNK47lAUmAwRtcUXyBQkpNwMOe1No5QFjnVLNL4203URM2xAh+d3vxE
rGvNOmW4LjxUr2DNuGKc8QKBgQC5Fk9Lzy1f0CEP1ya99vCDnSOHU/v8LUWJKYsd
gAMpEypHr/UC2zQ3fcNmp550YC24duvGgrzA1yn3ioTdmHQ/b+Za47T5wWaU2q9t
ygkUb0czi8rzKubWi9JKPO0UssyHTotUl8/xXxArnf+6tqLcCazvcvUdCmtor4Op
TV7OQwKBgE9gG5aqGoH+Grk5PDs90MyDp0EHzMn1mjOLzTCP0PdAgCk32Vwlpy99
78J5UwGlRqEsZwuGfhbQcdXFXxk7ceqC3sgX8ANgcMgF8WxiuLW0+1HxKMMXjUNr
r9IuAt0iYw1hNt6W1/1EACFRliRYNxkGPvpi6p7RH02tNzuPwlFx
-----END RSA PRIVATE KEY-----`,
    },
  });

  await xya.session.init();

  console.log(xya);
}

bootstrap();
