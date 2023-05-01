const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /author/name', async () => {
  await supertest(app).get('/author/name')
    .expect(200)
    .then((res) => {
      expect(res.text).toMatch(/(?!.* John Doe$)^Created by .*$/);
    });
});

test('GET /author/pennkey', async () => {
  await supertest(app).get('/author/pennkey')
    .expect(200)
    .then((res) => {
      expect(res.text).toMatch(/(?!.* jdoe$)^Created by .*$/);
    });
});

test('GET /random', async () => {
  await supertest(app).get('/random')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({
        song_id: expect.any(String),
        title: expect.any(String),
      });
    });
});

test('GET /song/0kN3oXYWWAk1uC0y2WoyOE', async () => {
  await supertest(app).get('/song/0kN3oXYWWAk1uC0y2WoyOE')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.song)
    });
});

test('GET /album/3lS1y25WAhcqJDATJK70Mq', async () => {
  await supertest(app).get('/album/3lS1y25WAhcqJDATJK70Mq')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.album)
    });
});

test('GET /albums', async () => {
  await supertest(app).get('/albums')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.albums)
    });
});

test('GET /album_songs/6AORtDjduMM3bupSWzbTSG', async () => {
  await supertest(app).get('/album_songs/6AORtDjduMM3bupSWzbTSG')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.album_songs)
    });
});

test('GET /top_songs all', async () => {
  await supertest(app).get('/top_songs')
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(238)
      expect(res.body[22]).toStrictEqual(results.top_songs_all_22)
    });
});

test('GET /top_songs page 3', async () => {
  await supertest(app).get('/top_songs?page=3')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.top_songs_page_3)
    });
});

test('GET /top_songs page 5 page_size 3', async () => {
  await supertest(app).get('/top_songs?page=5&page_size=3')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.top_songs_page_5_page_size_3)
    });
});

test('GET /top_albums all', async () => {
  await supertest(app).get('/top_albums')
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(12)
      expect(res.body[7]).toStrictEqual(results.top_albums_all_7)
    });
});

test('GET /top_albums page 2', async () => {
  await supertest(app).get('/top_albums?page=2')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.top_albums_page_2)
    });
});

test('GET /top_albums page 5 page_size 1', async () => {
  await supertest(app).get('/top_albums?page=5&page_size=1')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.top_albums_page_5_page_size_1)
    });
});

test('GET /search_songs default', async () => {
  await supertest(app).get('/search_songs')
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(219)
      expect(res.body[0]).toStrictEqual({
        song_id: expect.any(String),
        album_id: expect.any(String),
        title: expect.any(String),
        number: expect.any(Number),
        duration: expect.any(Number),
        plays: expect.any(Number),
        danceability: expect.any(Number),
        energy: expect.any(Number),
        valence: expect.any(Number),
        tempo: expect.any(Number),
        key_mode: expect.any(String),
        explicit: expect.any(Number),
      });
    });
});

test('GET /search_songs filtered', async () => {
  await supertest(app).get('/search_songs?title=all&explicit=true&energy_low=0.5&valence_low=0.2&valence_high=0.8')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.search_songs_filtered)
    });
});