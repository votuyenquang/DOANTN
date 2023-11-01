const CenterSevice = require('../service/CenterSevice');
const moment = require('moment');


let seedData = async (req,res) => {
    let  seed =   await CenterSevice.seedData();
    return res.status();
};
let create = async (req, res) => {
    console.log(req.body)
    if (!req.body.phoneNumber || !req.body.email || !req.body.name || !req.body.birthday || !req.body.address || !req.body.password || !req.body.gender) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin s'
        })
    }
    if (req.file) {
        req.body.image = req.file.path;
    }


    if (!moment(req.body.birthday, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
            erroCode: 1,
            message: 'định dạng birthday không đúng. Ví dụ về định dạng đúng : 2022-11-20'
        })
    }
    if (req.body.password.length < 5 || req.body.password.length > 15) {
        return res.status(400).json({
            erroCode: 1,
            message: 'độ dài mật khẩu phải lớn hơn hoặc bằng 5 ký tự và không quá 15 ký tự'
        })
    }
    if (req.body.gender === '1') {
        req.body.images = 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg'
    } else {
        req.body.images = 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540809/profiles/female_defaule_avatar_ezuxcv.jpg'
    }
    req.body.active = '1'
    let message = await CenterSevice.createCenter(req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    }


}

let DeleteCenter = async (req, res) => {
    console.log('delete')
    let id = req.params.id;
    console.log(id)
    if (!id) {
        return res.status(400).json({ message: 'Thiếu tham số id' });
    }
    let resData = await CenterSevice.deleteCenter(id)
    if (resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if (resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
let getallCenter = async (req, res) => {
    let key;
    if (req.query.key === undefined) {
        key = ''
    } else {
        key = req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0 : req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData = await CenterSevice.getAllCenter(key, pageNumber, limit)
    let page = {};
    page.size = resData.size;
    page.totalPages = resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode: 0,
        message: 'OK',
        page: page,
        center: resData.center,
    })
}
let UpdateCenter = async (req, res) => {
    console.log('update')
    if (!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }
    if (req.file) {
        req.body.image = req.file.path;
    }
    let resData = await CenterSevice.UpdateCenter(req.params, req.body)
    if (resData.errCode == 2) {
        return res.status(404).json({
            errCode: resData.errCode,
            message: resData.errMessage
        })
    } else {
        return res.status(200).json({
            errCode: resData.errCode,
            message: resData.errMessage
        })
    }
}
let getCenterById = async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let resData = await CenterSevice.getCenterById(id);
        if (resData.center) {
            return res.status(200).json({
                errCode: 0,
                message: resData.center,
                countchildent: resData.countchildent,
                totalCommentlike:resData.totalCommentlike
            })
        }
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy center có id này',
            })
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let getcenterbyacountid = async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let center = await CenterSevice.getcenterbyacountid(id);
        if (center) {
            return res.status(200).json({
                errCode: 0,
                message: center,
            })
        }
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy center có id này',
            })
        }

    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}






const { kmeans } = require('ml-kmeans');

let getCenterAL = async (req, res) => {
   
    let key;
    if (req.query.key === undefined) {
        key = ''
    } else {
        key = req.query.key
    }
  
    let centers = await CenterSevice.getallcenterAL(key)
    let totalCommentlike = centers.totalCommentlike
    let center = centers.totalAmountchildre
    

    const totalsByCenterId = {};

    for (const item of totalCommentlike) {
        const { center_id, totalLike, totalComment } = item;
        if (totalsByCenterId[center_id]) {
            totalsByCenterId[center_id].totalLike += totalLike;
            totalsByCenterId[center_id].totalComment += totalComment;
        } else {
            totalsByCenterId[center_id] = {
                totalLike,
                totalComment
            };
        }
    }
    
    const mergedArray = Object.entries(totalsByCenterId).map(([center_id, totals]) => ({
        id: parseInt(center_id),
        center_id: parseInt(center_id),
        totalLike: totals.totalLike,
        totalComment: totals.totalComment
    }));

    // console.log(mergedArray);
    const data = [];
    for (const obj1 of center) {
        const { id, totalAmount, totalChildren } = obj1;

        // Tìm đối tượng tương ứng trong mảng thứ hai dựa trên center_id
        const obj2 = mergedArray.find(obj => obj.center_id === id);

        if (obj2) {
            // Chuyển đổi totalAmount từ chuỗi sang số
            const convertedTotalAmount = Number(totalAmount);

            // Ghép các thuộc tính từ cả hai đối tượng vào một đối tượng mới
            const mergedObj = [
                id,
                convertedTotalAmount,
                totalChildren,
                obj2.totalLike,
                obj2.totalComment
            ];

            // Thêm đối tượng đã ghép vào mảng mergedArray
            data.push(mergedObj);
        }
    }
    console.log(data)
    // console.log('key',centers.keyserch)
    let b=[0,5948745,45,50,100]
if(centers.keyserch.length!=0&&key!=''){
    let Ab=data.filter((_, dataIndex) => centers.keyserch[0].id === dataIndex)
    
    b=Ab.reduce((acc, curr) => acc.concat(curr), []);
    
}
console.log('aa',b)
    const maxK = 8;
    const inertias = [];

    for (let k = 1; k <= maxK; k++) {
        // Run K-means clustering
        const { clusters, centroids } = kmeans(data, k);
        // Calculate inertia (sum of squared distances)
        const inertiaValue = calculateInertia(data, clusters, centroids);
        // Store inertia
        inertias.push(inertiaValue);
    }

    let optimalK;
    let minDiff = Infinity;


    for (let i = 1; i < inertias.length - 1; i++) {
        const diff = Math.abs(inertias[i] - inertias[i + 1]);
        if (diff < minDiff) {
            minDiff = diff;
            optimalK = i + 1;
        }
    }
    
    const { clusters, centroids } = kmeans(data, optimalK);
    const suggestedWords = [b];

    // Tính toán độ tương đồng giữa từ gợi ý và centroids
    const similarities = suggestedWords.map((word) => {
        return centroids.map((centroid) => {
            // Tính toán cosine similarity giữa từ gợi ý và centroid
            const similarity = calculateCosineSimilarity(word, centroid);
            return similarity;
        });
    });
    console.log('similarities:', similarities)
    // Sắp xếp và chọn các từ gợi ý dựa trên độ tương đồng
    const numSuggestions = 1; // Số lượng từ gợi ý
    const suggestions = [];

    similarities.forEach((wordSimilarities, index) => {
        const sortedSimilarities = wordSimilarities
            .map((similarity, centroidIndex) => ({ centroidIndex, similarity }))
            .sort((a, b) => b.similarity - a.similarity);

        const topSuggestions = sortedSimilarities.slice(0, numSuggestions)
            .map((suggestion) => ({
                word: suggestedWords[suggestion.centroidIndex],
                similarity: suggestion.similarity,
                centroid: centroids[suggestion.centroidIndex] // Thêm giá trị của centroid tương ứng
            }));

        suggestions.push({ word: suggestedWords[index], suggestions: topSuggestions });
    });
    // Sắp xếp suggestions theo giá trị của centroids
    suggestions.sort((a, b) => {
        const centroidA = a.suggestions[0].centroid;
        const centroidB = b.suggestions[0].centroid;
        return centroidA - centroidB;
    });
    const centroidList = suggestions.map((suggestion) => suggestion.suggestions[0].centroid);
    // Hiển thị kết quả gợi ý
    // console.log("Centroids from Suggestions:", centroidList);

    // // Hiển thị trung tâm của các cụm
    // console.log("Centroids:", centroids);
    // console.log("clusters:", clusters);
    // Lấy dữ liệu theo cụm

    // Lấy dữ liệu của centroids
    const dataByCentroids = centroids.map((centroid, centroidIndex) => ({
        centroid: centroidIndex,
        values: data.filter((_, dataIndex) => clusters[dataIndex] === centroidIndex),
    }));
    const filteredDataByCentroids = centroids
        .filter((centroid) => centroidList.includes(centroid))
        .map((centroid) => {
            const centroidIndex = centroids.indexOf(centroid);
            return {
                centroid: centroidIndex,
                values: dataByCentroids[centroidIndex].values,
            };
        });


    console.log("Filtered Data by Centroids:");
    console.log(filteredDataByCentroids.flat());
    const valuesFromCentroids = filteredDataByCentroids.map((data) => data.values);
    console.log("Values from Filtered Data by Centroids:");
    console.log(valuesFromCentroids);
    const flattenedValues = valuesFromCentroids.flat();

    const centersByIds = center.filter((item) => flattenedValues.some((centroid) => centroid[0] === item.id));
        if(key==''){
            searchcenter=[]
        }else{
            if(centers.keyserch.length!=0){
                searchcenter=centers.keyserch[0]
            }
            else{
                searchcenter=[]
            }
        }
  
    return res.status(200).json({
        erroCode: 0,
        message: 'OK',
        k: optimalK,
        // dataByCentroids: dataByCentroids,
        center:centersByIds,
        // suggestions: suggestions,
        searchcenter: searchcenter,
        filteredDataByCentroids: filteredDataByCentroids,

    });
};

function calculateCosineSimilarity(vectorA, vectorB) {
    // Ensure vectorA and vectorB have the same length
    if (vectorA.length !== vectorB.length) {
        throw new Error('Vectors must have the same length');
    }

    // Calculate dot product of vectorA and vectorB
    let dotProduct = 0;
    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
    }

    // Calculate magnitude of vectorA
    let magnitudeA = 0;
    for (let i = 0; i < vectorA.length; i++) {
        magnitudeA += vectorA[i] ** 2;
    }
    magnitudeA = Math.sqrt(magnitudeA);

    // Calculate magnitude of vectorB
    let magnitudeB = 0;
    for (let i = 0; i < vectorB.length; i++) {
        magnitudeB += vectorB[i] ** 2;
    }
    magnitudeB = Math.sqrt(magnitudeB);

    // Calculate cosine similarity
    const similarity = dotProduct / (magnitudeA * magnitudeB);

    return similarity;
}
// Function to calculate inertia
function calculateInertia(data, clusters, centroids) {
    let inertiaValue = 0;
    for (let i = 0; i < data.length; i++) {
        const point = data[i];
        const clusterIndex = clusters[i];
        const centroid = centroids[clusterIndex];
        const distance = calculateDistance(point, centroid);
        inertiaValue += distance ** 2;
    }

    return inertiaValue;
}

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
    // Implement your desired distance calculation method here
    // For example, you can use Euclidean distance
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += (point1[i] - point2[i]) ** 2;
    }
    return Math.sqrt(sum);
}
module.exports = {
    create: create,
    DeleteCenter: DeleteCenter,
    getallCenter: getallCenter,
    UpdateCenter: UpdateCenter,
    getCenterById: getCenterById,
    getcenterbyacountid: getcenterbyacountid,
    getcenterAl: getCenterAL,
    seedData : seedData
}