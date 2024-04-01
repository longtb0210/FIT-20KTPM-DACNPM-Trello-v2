import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { CardlistServiceModule } from '../src/cardlist.module'

describe('CardlistController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CardlistServiceModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach((done) => {
    app.close().then(() => done())
  })

  it('/api/cardlist (GET)', () => {
    return request(app.getHttpServer()).get('/api/cardlist').expect(200)
  })
  it('/api/cardlist/create (POST)', () => {
    return request(app.getHttpServer()).post('/api/cardlist/create').expect(200)
  })

  it('/api/cardlist/copy (POST)', () => {
    return request(app.getHttpServer()).post('/api/cardlist/copy').expect(200)
  })

  it('/api/cardlist/cardlist_by_board/:boardId (GET)', () => {
    const boardId = 'sampleBoardId' // Replace with an actual board ID for testing
    return request(app.getHttpServer()).get(`/api/cardlist/cardlist_by_board/${boardId}`).expect(200)
  })

  it('/api/cardlist/cardlist_archived_by_board/:boardId (GET)', () => {
    const boardId = 'sampleBoardId' // Replace with an actual board ID for testing
    return request(app.getHttpServer()).get(`/api/cardlist/cardlist_archived_by_board/${boardId}`).expect(200)
  })

  it('/api/cardlist/cardlist_non_archived_by_board/:boardId (GET)', () => {
    const boardId = 'sampleBoardId' // Replace with an actual board ID for testing
    return request(app.getHttpServer()).get(`/api/cardlist/cardlist_non_archived_by_board/${boardId}`).expect(200)
  })

  it('/api/cardlist/sort_oldest_cardlist/:boardId (GET)', () => {
    const boardId = 'sampleBoardId' // Replace with an actual board ID for testing
    return request(app.getHttpServer()).get(`/api/cardlist/sort_oldest_cardlist/${boardId}`).expect(200)
  })

  it('/api/cardlist/sort_newest_cardlist/:boardId (GET)', () => {
    const boardId = 'sampleBoardId' // Replace with an actual board ID for testing
    return request(app.getHttpServer()).get(`/api/cardlist/sort_newest_cardlist/${boardId}`).expect(200)
  })

  it('/api/cardlist/sort_name_cardlist/:boardId (GET)', () => {
    const boardId = 'sampleBoardId' // Replace with an actual board ID for testing
    return request(app.getHttpServer()).get(`/api/cardlist/sort_name_cardlist/${boardId}`).expect(200)
  })

  it('/api/cardlist/update (PUT)', () => {
    return request(app.getHttpServer()).put('/api/cardlist/update').expect(200)
  })

  it('/api/cardlist/move (PUT)', () => {
    return request(app.getHttpServer()).put('/api/cardlist/move').expect(200)
  })

  it('/api/cardlist/archive_cards_in_list/:cardlistId (PATCH)', () => {
    const cardlistId = 'sampleCardlistId' // Replace with an actual cardlist ID for testing
    return request(app.getHttpServer()).patch(`/api/cardlist/archive_cards_in_list/${cardlistId}`).expect(200)
  })

  it('/api/cardlist/archive_card_list/:cardlistId (PATCH)', () => {
    const cardlistId = 'sampleCardlistId' // Replace with an actual cardlist ID for testing
    return request(app.getHttpServer()).patch(`/api/cardlist/archive_card_list/${cardlistId}`).expect(200)
  })

  it('/api/cardlist/add_watcher (PATCH)', () => {
    return request(app.getHttpServer()).patch('/api/cardlist/add_watcher').expect(200)
  })

  it('/api/cardlist/add_card (POST)', () => {
    return request(app.getHttpServer()).post('/api/cardlist/add_card').expect(200)
  })

  it('/api/cardlist/clone_cardlists (POST)', () => {
    return request(app.getHttpServer()).post('/api/cardlist/clone_cardlists').expect(200)
  })

  it('/api/cardlist/delete_cardlists_by_board_id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/api/cardlist/delete_cardlists_by_board_id').expect(200)
  })
})
