import * as assert from "power-assert";
import * as Mock from "./mock";
import * as app from "../../../index";
import * as Config from "../../config.local";
import * as common from "../../common/index";

describe("GEO高级功能", async () => {
    const config = {
        secretId: Config.secretId,
        secretKey: Config.secretKey,
        env: Mock.env,
        mpAppId: Mock.appId,
        proxy: Config.proxy,
        sessionToken: undefined
    };

    app.init(config);
    const db = app.database();

    const collName = "coll-1";
    const collection = db.collection(collName);
    function randomPoint() {
        return new db.Geo.Point(
            180 - 360 * Math.random(),
            90 - 180 * Math.random()
        )
    }

    it("Document - createCollection()", async () => {
        await common.safeCreateCollection(db, collName);
    });

    const point = randomPoint()
    const line = new db.Geo.LineString([randomPoint(), randomPoint()])

    // “回”字的外环
    const point1 = new db.Geo.Point(-2, -2)
    const point2 = new db.Geo.Point(2, -2)
    const point3 = new db.Geo.Point(2, 2)
    const point4 = new db.Geo.Point(-2, 2);
    // “回”字的内环
    const point5 = new db.Geo.Point(-1, -1)
    const point6 = new db.Geo.Point(1, -1)
    const point7 = new db.Geo.Point(1, 1)
    const point8 = new db.Geo.Point(-1, 1);
    const polygon = new db.Geo.Polygon([
        new db.Geo.LineString([point1, point2, point3, point4, point1]),
        new db.Geo.LineString([point5, point6, point7, point8, point5]),
    ])

    const multiPoint = new db.Geo.MultiPoint([randomPoint(), randomPoint(), randomPoint(), randomPoint()])
    const multiLineString = new db.Geo.MultiLineString([
        new db.Geo.LineString([randomPoint(), randomPoint()]),
        new db.Geo.LineString([randomPoint(), randomPoint()]),
        new db.Geo.LineString([randomPoint(), randomPoint()]),
        new db.Geo.LineString([randomPoint(), randomPoint()])
    ])
    const multiPolygon = new db.Geo.MultiPolygon([
        new db.Geo.Polygon([
            new db.Geo.LineString([point1, point2, point3, point4, point1])
        ]),
        new db.Geo.Polygon([
            new db.Geo.LineString([point5, point6, point7, point8, point5])
        ])
    ])

    const initialData = {
        point,
        line,
        polygon,
        multiPoint,
        multiLineString,
        multiPolygon
    };

    it("GEO Advanced - CRUD", async () => {
        // Create
        const res = await collection.add(initialData);
        assert(res.id);
        assert(res.requestId);

        // Read
        const readRes = await collection
            .where({
                _id: res.id
            })
            .get();
        console.log(readRes.data);
        assert(readRes.data.length > 0);
        const data = readRes.data[0]

        assert(data.point instanceof db.Geo.Point)
        assert(data.line instanceof db.Geo.LineString)
        assert(data.polygon instanceof db.Geo.Polygon)
        assert(data.multiPoint instanceof db.Geo.MultiPoint)
        assert(data.multiLineString instanceof db.Geo.MultiLineString)
        assert(data.multiPolygon instanceof db.Geo.MultiPolygon)

        assert.deepEqual(data.point, point)
        assert.deepEqual(data.line, line)
        assert.deepEqual(data.polygon, polygon)
        assert.deepEqual(data.multiPoint, multiPoint)
        assert.deepEqual(data.multiLineString, multiLineString)
        assert.deepEqual(data.multiPolygon, multiPolygon)

        // Update
        let result = await collection.doc(res.id).set(initialData)
        console.log(result)
        assert.strictEqual(result.updated, 1)
        assert(result.requestId);

        // Delete
        const deleteRes = await collection
            .where({
                _id: res.id
            })
            .remove();
        console.log(deleteRes);
        assert.strictEqual(deleteRes.deleted, 1);
    });

    it("GEO - bad create", () => {

        // bad Point
        assert.throws(
            () => new db.Geo.Point()
        )
        assert.throws(
            () => new db.Geo.Point([], {})
        )

        // bad LineString
        assert.throws(
            () => new db.Geo.LineString({})
        )
        assert.throws(
            () => new db.Geo.LineString([])
        )
        assert.throws(
            () => new db.Geo.LineString([123, []])
        )

        // bad Polygon
        assert.throws(
            () => new db.Geo.Polygon(null)
        )
        assert.throws(
            () => new db.Geo.Polygon([])
        )
        assert.throws(
            () => new db.Geo.Polygon([666, 789])
        )
        assert.throws(
            () => new db.Geo.Polygon([
                new db.Geo.LineString([point1, point2, point3, point4, point8])
            ])
        )

        // bad MultiPoint
        assert.throws(
            () => new db.Geo.MultiPoint({})
        )
        assert.throws(
            () => new db.Geo.MultiPoint([])
        )
        assert.throws(
            () => new db.Geo.MultiPoint([{}, {}])
        )

        // bad MultiLineString
        assert.throws(
            () => new db.Geo.MultiLineString({})
        )
        assert.throws(
            () => new db.Geo.MultiLineString([])
        )
        assert.throws(
            () => new db.Geo.MultiLineString([123, null])
        )

        // bad MultiPolygon
        assert.throws(
            () => new db.Geo.MultiPolygon(123)
        )
        assert.throws(
            () => new db.Geo.MultiPolygon([])
        )
        assert.throws(
            () => new db.Geo.MultiPolygon([666, 666])
        )
    })

    it("GEO - geoNear", async () => {
        // Create
        const res = await collection.add(initialData);
        assert(res.id);
        assert(res.requestId);

        // Read
        const readRes = await collection
            .where({
                point: db.command.geoNear({
                    geometry: point,
                    maxDistance: 100,
                    minDistance: 0
                })
            }).get()
        console.log(readRes.data);
        assert(readRes.data.length > 0);
        assert.deepEqual(readRes.data[0].point, point)
        assert.deepEqual(readRes.data[0].line, line)

        // Delete
        const deleteRes = await collection
            .where({
                _id: res.id
            })
            .remove();
        console.log(deleteRes);
        assert.strictEqual(deleteRes.deleted, 1);
    });


});