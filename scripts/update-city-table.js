const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const allCitiesData = [
    { name: '北京', province: 'BEJ', lat: 39.9042, lng: 116.4074 },
    { name: '上海', province: 'SHA', lat: 31.2304, lng: 121.4737 },
    { name: '天津', province: 'TSN', lat: 39.3434, lng: 117.3616 },
    { name: '重庆', province: 'CQG', lat: 29.4316, lng: 106.9123 },
    { name: '石家庄', province: 'HEB', lat: 38.0423, lng: 114.5149 },
    { name: '唐山', province: 'HEB', lat: 39.6308, lng: 118.1802 },
    { name: '秦皇岛', province: 'HEB', lat: 39.8882, lng: 119.5202 },
    { name: '邯郸', province: 'HEB', lat: 36.6258, lng: 114.5392 },
    { name: '邢台', province: 'HEB', lat: 37.0717, lng: 114.5047 },
    { name: '保定', province: 'HEB', lat: 38.8745, lng: 115.4645 },
    { name: '张家口', province: 'HEB', lat: 40.7691, lng: 114.8859 },
    { name: '承德', province: 'HEB', lat: 40.9530, lng: 117.9628 },
    { name: '沧州', province: 'HEB', lat: 38.3047, lng: 116.8387 },
    { name: '廊坊', province: 'HEB', lat: 39.5383, lng: 116.6836 },
    { name: '衡水', province: 'HEB', lat: 37.7394, lng: 115.6691 },
    { name: '太原', province: 'SXI', lat: 37.8705, lng: 112.5489 },
    { name: '大同', province: 'SXI', lat: 40.0968, lng: 113.3668 },
    { name: '阳泉', province: 'SXI', lat: 37.8571, lng: 113.5805 },
    { name: '长治', province: 'SXI', lat: 36.1950, lng: 113.1170 },
    { name: '晋城', province: 'SXI', lat: 35.4912, lng: 112.8516 },
    { name: '朔州', province: 'SXI', lat: 39.3319, lng: 112.4329 },
    { name: '晋中', province: 'SXI', lat: 37.6880, lng: 112.7527 },
    { name: '运城', province: 'SXI', lat: 35.0266, lng: 111.0070 },
    { name: '忻州', province: 'SXI', lat: 38.4161, lng: 112.7343 },
    { name: '临汾', province: 'SXI', lat: 36.0882, lng: 111.5189 },
    { name: '吕梁', province: 'SXI', lat: 37.5202, lng: 111.1441 },
    { name: '呼和浩特', province: 'NMG', lat: 40.8421, lng: 111.7489 },
    { name: '包头', province: 'NMG', lat: 40.6220, lng: 109.9537 },
    { name: '乌海', province: 'NMG', lat: 39.6550, lng: 106.7942 },
    { name: '赤峰', province: 'NMG', lat: 42.2577, lng: 118.8872 },
    { name: '通辽', province: 'NMG', lat: 43.6536, lng: 122.2433 },
    { name: '鄂尔多斯', province: 'NMG', lat: 39.6088, lng: 109.7824 },
    { name: '呼伦贝尔', province: 'NMG', lat: 50.2435, lng: 120.1833 },
    { name: '巴彦淖尔', province: 'NMG', lat: 40.7429, lng: 107.3879 },
    { name: '乌兰察布', province: 'NMG', lat: 40.9945, lng: 113.1323 },
    { name: '兴安盟', province: 'NMG', lat: 46.0769, lng: 122.0378 },
    { name: '锡林郭勒盟', province: 'NMG', lat: 43.9333, lng: 116.0500 },
    { name: '阿拉善盟', province: 'NMG', lat: 38.8318, lng: 105.7282 },
    { name: '沈阳', province: 'LNG', lat: 41.8041, lng: 123.4291 },
    { name: '大连', province: 'LNG', lat: 38.9140, lng: 121.6147 },
    { name: '鞍山', province: 'LNG', lat: 41.1066, lng: 122.9942 },
    { name: '抚顺', province: 'LNG', lat: 41.8807, lng: 123.9573 },
    { name: '本溪', province: 'LNG', lat: 41.2962, lng: 123.7650 },
    { name: '丹东', province: 'LNG', lat: 40.1290, lng: 124.3545 },
    { name: '锦州', province: 'LNG', lat: 41.0953, lng: 121.1268 },
    { name: '营口', province: 'LNG', lat: 40.6679, lng: 122.2349 },
    { name: '阜新', province: 'LNG', lat: 42.0211, lng: 121.6707 },
    { name: '辽阳', province: 'LNG', lat: 41.2686, lng: 123.1732 },
    { name: '盘锦', province: 'LNG', lat: 41.1199, lng: 122.0706 },
    { name: '铁岭', province: 'LNG', lat: 42.2861, lng: 123.8442 },
    { name: '朝阳', province: 'LNG', lat: 41.5734, lng: 120.4510 },
    { name: '葫芦岛', province: 'LNG', lat: 40.7106, lng: 120.8378 },
    { name: '长春', province: 'JLN', lat: 43.8968, lng: 125.3245 },
    { name: '吉林', province: 'JLN', lat: 43.8377, lng: 126.5494 },
    { name: '四平', province: 'JLN', lat: 43.1666, lng: 124.3507 },
    { name: '辽源', province: 'JLN', lat: 42.8879, lng: 125.1436 },
    { name: '通化', province: 'JLN', lat: 41.7283, lng: 125.9399 },
    { name: '白山', province: 'JLN', lat: 41.9434, lng: 126.4274 },
    { name: '松原', province: 'JLN', lat: 45.1418, lng: 124.8252 },
    { name: '白城', province: 'JLN', lat: 45.6196, lng: 122.8387 },
    { name: '延边朝鲜族自治州', province: 'JLN', lat: 42.8914, lng: 129.5090 },
    { name: '哈尔滨', province: 'HLJ', lat: 45.8038, lng: 126.5340 },
    { name: '齐齐哈尔', province: 'HLJ', lat: 47.3543, lng: 123.9180 },
    { name: '鸡西', province: 'HLJ', lat: 45.2954, lng: 130.9694 },
    { name: '鹤岗', province: 'HLJ', lat: 47.3499, lng: 130.2977 },
    { name: '双鸭山', province: 'HLJ', lat: 46.6469, lng: 131.1592 },
    { name: '大庆', province: 'HLJ', lat: 46.5897, lng: 125.0325 },
    { name: '伊春', province: 'HLJ', lat: 47.7276, lng: 128.8992 },
    { name: '佳木斯', province: 'HLJ', lat: 46.8024, lng: 130.3188 },
    { name: '七台河', province: 'HLJ', lat: 45.7710, lng: 130.9534 },
    { name: '牡丹江', province: 'HLJ', lat: 44.5512, lng: 129.6329 },
    { name: '黑河', province: 'HLJ', lat: 50.2449, lng: 127.5285 },
    { name: '绥化', province: 'HLJ', lat: 46.6526, lng: 126.9688 },
    { name: '大兴安岭地区', province: 'HLJ', lat: 51.9600, lng: 124.1200 },
    { name: '南京', province: 'JSU', lat: 32.0603, lng: 118.7969 },
    { name: '无锡', province: 'JSU', lat: 31.4912, lng: 120.3119 },
    { name: '徐州', province: 'JSU', lat: 34.2734, lng: 117.1881 },
    { name: '常州', province: 'JSU', lat: 31.8112, lng: 119.9740 },
    { name: '苏州', province: 'JSU', lat: 31.2989, lng: 120.5853 },
    { name: '南通', province: 'JSU', lat: 31.9802, lng: 120.8942 },
    { name: '连云港', province: 'JSU', lat: 34.5967, lng: 119.2216 },
    { name: '淮安', province: 'JSU', lat: 33.5517, lng: 119.0153 },
    { name: '盐城', province: 'JSU', lat: 33.3477, lng: 120.1615 },
    { name: '扬州', province: 'JSU', lat: 32.3932, lng: 119.4126 },
    { name: '镇江', province: 'JSU', lat: 32.1880, lng: 119.4250 },
    { name: '泰州', province: 'JSU', lat: 32.4560, lng: 119.9230 },
    { name: '宿迁', province: 'JSU', lat: 33.9633, lng: 118.2758 },
    { name: '杭州', province: 'ZJG', lat: 30.2741, lng: 120.1551 },
    { name: '宁波', province: 'ZJG', lat: 29.8683, lng: 121.5440 },
    { name: '温州', province: 'ZJG', lat: 28.0006, lng: 120.6998 },
    { name: '嘉兴', province: 'ZJG', lat: 30.7522, lng: 120.7550 },
    { name: '湖州', province: 'ZJG', lat: 30.8927, lng: 120.0930 },
    { name: '绍兴', province: 'ZJG', lat: 30.0304, lng: 120.5801 },
    { name: '金华', province: 'ZJG', lat: 29.0789, lng: 119.6478 },
    { name: '衢州', province: 'ZJG', lat: 28.9356, lng: 118.8740 },
    { name: '舟山', province: 'ZJG', lat: 29.9853, lng: 122.1073 },
    { name: '台州', province: 'ZJG', lat: 28.6560, lng: 121.4209 },
    { name: '丽水', province: 'ZJG', lat: 28.4677, lng: 119.9229 },
    { name: '合肥', province: 'AHI', lat: 31.8206, lng: 117.2272 },
    { name: '芜湖', province: 'AHI', lat: 31.3529, lng: 118.3760 },
    { name: '蚌埠', province: 'AHI', lat: 32.9167, lng: 117.3886 },
    { name: '淮南', province: 'AHI', lat: 32.6264, lng: 116.9997 },
    { name: '马鞍山', province: 'AHI', lat: 31.6686, lng: 118.5076 },
    { name: '淮北', province: 'AHI', lat: 33.9550, lng: 116.7980 },
    { name: '铜陵', province: 'AHI', lat: 30.9409, lng: 117.8122 },
    { name: '安庆', province: 'AHI', lat: 30.5431, lng: 117.0634 },
    { name: '黄山', province: 'AHI', lat: 29.7145, lng: 118.3378 },
    { name: '滁州', province: 'AHI', lat: 32.3017, lng: 118.3172 },
    { name: '阜阳', province: 'AHI', lat: 32.8908, lng: 115.8142 },
    { name: '宿州', province: 'AHI', lat: 33.6460, lng: 116.9639 },
    { name: '六安', province: 'AHI', lat: 31.7348, lng: 116.5079 },
    { name: '亳州', province: 'AHI', lat: 33.8446, lng: 115.7782 },
    { name: '池州', province: 'AHI', lat: 30.6644, lng: 117.4917 },
    { name: '宣城', province: 'AHI', lat: 30.9407, lng: 118.7585 },
    { name: '福州', province: 'FJN', lat: 26.0753, lng: 119.2965 },
    { name: '厦门', province: 'FJN', lat: 24.4798, lng: 118.0894 },
    { name: '莆田', province: 'FJN', lat: 25.4540, lng: 119.0078 },
    { name: '三明', province: 'FJN', lat: 26.2654, lng: 117.6389 },
    { name: '泉州', province: 'FJN', lat: 24.8740, lng: 118.6758 },
    { name: '漳州', province: 'FJN', lat: 24.5129, lng: 117.6471 },
    { name: '南平', province: 'FJN', lat: 26.6418, lng: 118.1780 },
    { name: '龙岩', province: 'FJN', lat: 25.0750, lng: 117.0173 },
    { name: '宁德', province: 'FJN', lat: 26.6657, lng: 119.5477 },
    { name: '南昌', province: 'JXI', lat: 28.6820, lng: 115.8579 },
    { name: '景德镇', province: 'JXI', lat: 29.2688, lng: 117.1786 },
    { name: '萍乡', province: 'JXI', lat: 27.6229, lng: 113.8545 },
    { name: '九江', province: 'JXI', lat: 29.7048, lng: 116.0018 },
    { name: '新余', province: 'JXI', lat: 27.8178, lng: 114.9171 },
    { name: '鹰潭', province: 'JXI', lat: 28.2602, lng: 117.0694 },
    { name: '赣州', province: 'JXI', lat: 25.8292, lng: 114.9354 },
    { name: '吉安', province: 'JXI', lat: 27.1138, lng: 114.9930 },
    { name: '宜春', province: 'JXI', lat: 27.8136, lng: 114.4163 },
    { name: '抚州', province: 'JXI', lat: 27.9545, lng: 116.3582 },
    { name: '上饶', province: 'JXI', lat: 28.4553, lng: 117.9433 },
    { name: '济南', province: 'SDG', lat: 36.6512, lng: 116.9869 },
    { name: '青岛', province: 'SDG', lat: 36.0671, lng: 120.3826 },
    { name: '淄博', province: 'SDG', lat: 36.8131, lng: 118.0548 },
    { name: '枣庄', province: 'SDG', lat: 34.8107, lng: 117.3237 },
    { name: '东营', province: 'SDG', lat: 37.4346, lng: 118.6749 },
    { name: '烟台', province: 'SDG', lat: 37.5365, lng: 121.3914 },
    { name: '潍坊', province: 'SDG', lat: 36.7068, lng: 119.1619 },
    { name: '济宁', province: 'SDG', lat: 35.4147, lng: 116.5871 },
    { name: '泰安', province: 'SDG', lat: 36.1950, lng: 117.0880 },
    { name: '威海', province: 'SDG', lat: 37.5133, lng: 122.1205 },
    { name: '日照', province: 'SDG', lat: 35.4164, lng: 119.5269 },
    { name: '临沂', province: 'SDG', lat: 35.1041, lng: 118.3566 },
    { name: '德州', province: 'SDG', lat: 37.4360, lng: 116.3075 },
    { name: '聊城', province: 'SDG', lat: 36.4565, lng: 115.9854 },
    { name: '滨州', province: 'SDG', lat: 37.3816, lng: 117.9706 },
    { name: '菏泽', province: 'SDG', lat: 35.2333, lng: 115.4809 },
    { name: '郑州', province: 'HAN', lat: 34.7466, lng: 113.6254 },
    { name: '开封', province: 'HAN', lat: 34.7971, lng: 114.3074 },
    { name: '洛阳', province: 'HAN', lat: 34.6197, lng: 112.4540 },
    { name: '平顶山', province: 'HAN', lat: 33.7669, lng: 113.1925 },
    { name: '安阳', province: 'HAN', lat: 36.0976, lng: 114.3925 },
    { name: '鹤壁', province: 'HAN', lat: 35.7482, lng: 114.2972 },
    { name: '新乡', province: 'HAN', lat: 35.3026, lng: 113.9268 },
    { name: '焦作', province: 'HAN', lat: 35.2159, lng: 113.2420 },
    { name: '濮阳', province: 'HAN', lat: 35.7546, lng: 115.0297 },
    { name: '许昌', province: 'HAN', lat: 34.0357, lng: 113.8526 },
    { name: '漯河', province: 'HAN', lat: 33.5813, lng: 114.0166 },
    { name: '三门峡', province: 'HAN', lat: 34.7726, lng: 111.1941 },
    { name: '南阳', province: 'HAN', lat: 32.9987, lng: 112.5292 },
    { name: '商丘', province: 'HAN', lat: 34.4144, lng: 115.6563 },
    { name: '信阳', province: 'HAN', lat: 32.1469, lng: 114.0913 },
    { name: '周口', province: 'HAN', lat: 33.6260, lng: 114.6497 },
    { name: '驻马店', province: 'HAN', lat: 33.0111, lng: 114.0225 },
    { name: '武汉', province: 'HBI', lat: 30.5928, lng: 114.3055 },
    { name: '黄石', province: 'HBI', lat: 30.1999, lng: 115.0389 },
    { name: '十堰', province: 'HBI', lat: 32.6294, lng: 110.7980 },
    { name: '宜昌', province: 'HBI', lat: 30.6918, lng: 111.2868 },
    { name: '襄阳', province: 'HBI', lat: 32.0089, lng: 112.1226 },
    { name: '襄阳', province: 'HBI', lat: 32.0089, lng: 112.1226 },
    { name: '鄂州', province: 'HBI', lat: 30.3907, lng: 114.8948 },
    { name: '荆门', province: 'HBI', lat: 31.0354, lng: 112.1991 },
    { name: '孝感', province: 'HBI', lat: 30.9279, lng: 113.9266 },
    { name: '荆州', province: 'HBI', lat: 30.3269, lng: 112.2394 },
    { name: '黄冈', province: 'HBI', lat: 30.4534, lng: 114.8725 },
    { name: '咸宁', province: 'HBI', lat: 29.8415, lng: 114.3223 },
    { name: '随州', province: 'HBI', lat: 31.6903, lng: 113.3824 },
    { name: '恩施土家族苗族自治州', province: 'HBI', lat: 30.2720, lng: 109.4880 },
    { name: '长沙', province: 'HNN', lat: 28.2282, lng: 112.9388 },
    { name: '株洲', province: 'HNN', lat: 27.8274, lng: 113.1340 },
    { name: '湘潭', province: 'HNN', lat: 27.8291, lng: 112.9442 },
    { name: '衡阳', province: 'HNN', lat: 26.8933, lng: 112.5720 },
    { name: '邵阳', province: 'HNN', lat: 27.2389, lng: 111.4674 },
    { name: '岳阳', province: 'HNN', lat: 29.3570, lng: 113.1287 },
    { name: '常德', province: 'HNN', lat: 29.0319, lng: 111.6985 },
    { name: '张家界', province: 'HNN', lat: 29.1173, lng: 110.4794 },
    { name: '益阳', province: 'HNN', lat: 28.5539, lng: 112.3552 },
    { name: '郴州', province: 'HNN', lat: 25.7704, lng: 113.0149 },
    { name: '永州', province: 'HNN', lat: 26.4346, lng: 111.6131 },
    { name: '怀化', province: 'HNN', lat: 27.5500, lng: 110.0010 },
    { name: '娄底', province: 'HNN', lat: 27.6982, lng: 111.9934 },
    { name: '广州', province: 'GDN', lat: 23.1291, lng: 113.2644 },
    { name: '韶关', province: 'GDN', lat: 24.8108, lng: 113.5975 },
    { name: '深圳', province: 'GDN', lat: 22.5431, lng: 114.0579 },
    { name: '珠海', province: 'GDN', lat: 22.2710, lng: 113.5767 },
    { name: '汕头', province: 'GDN', lat: 23.3535, lng: 116.6821 },
    { name: '佛山', province: 'GDN', lat: 23.0218, lng: 113.1219 },
    { name: '江门', province: 'GDN', lat: 22.5789, lng: 113.0815 },
    { name: '湛江', province: 'GDN', lat: 21.2707, lng: 110.3594 },
    { name: '茂名', province: 'GDN', lat: 21.6629, lng: 110.9254 },
    { name: '肇庆', province: 'GDN', lat: 23.0469, lng: 112.4654 },
    { name: '惠州', province: 'GDN', lat: 23.1115, lng: 114.4158 },
    { name: '梅州', province: 'GDN', lat: 24.2883, lng: 116.1176 },
    { name: '汕尾', province: 'GDN', lat: 22.7861, lng: 115.3644 },
    { name: '河源', province: 'GDN', lat: 23.7463, lng: 114.7006 },
    { name: '阳江', province: 'GDN', lat: 21.8576, lng: 111.9825 },
    { name: '清远', province: 'GDN', lat: 23.6820, lng: 113.0510 },
    { name: '东莞', province: 'GDN', lat: 23.0430, lng: 113.7633 },
    { name: '中山', province: 'GDN', lat: 22.5176, lng: 113.3926 },
    { name: '潮州', province: 'GDN', lat: 23.6567, lng: 116.6223 },
    { name: '揭阳', province: 'GDN', lat: 23.5499, lng: 116.3728 },
    { name: '云浮', province: 'GDN', lat: 22.9293, lng: 112.0444 },
    { name: '南宁', province: 'GXI', lat: 22.8170, lng: 108.3665 },
    { name: '柳州', province: 'GXI', lat: 24.3263, lng: 109.4286 },
    { name: '桂林', province: 'GXI', lat: 25.2738, lng: 110.2900 },
    { name: '梧州', province: 'GXI', lat: 23.4769, lng: 111.2791 },
    { name: '北海', province: 'GXI', lat: 21.4734, lng: 109.1192 },
    { name: '防城港', province: 'GXI', lat: 21.6874, lng: 108.3541 },
    { name: '钦州', province: 'GXI', lat: 21.9817, lng: 108.6543 },
    { name: '贵港', province: 'GXI', lat: 23.1033, lng: 109.5986 },
    { name: '玉林', province: 'GXI', lat: 22.6540, lng: 110.1806 },
    { name: '百色', province: 'GXI', lat: 23.9027, lng: 106.6181 },
    { name: '贺州', province: 'GXI', lat: 24.4034, lng: 111.5669 },
    { name: '河池', province: 'GXI', lat: 24.6929, lng: 108.0853 },
    { name: '来宾', province: 'GXI', lat: 23.7500, lng: 109.2216 },
    { name: '崇左', province: 'GXI', lat: 22.3768, lng: 107.3646 },
    { name: '海口', province: 'HAI', lat: 20.0444, lng: 110.1999 },
    { name: '三亚', province: 'HAI', lat: 18.2528, lng: 109.5119 },
    { name: '三沙', province: 'HAI', lat: 16.8331, lng: 112.3333 },
    { name: '儋州', province: 'HAI', lat: 19.5175, lng: 109.5809 },
    { name: '成都', province: 'SCN', lat: 30.5728, lng: 104.0668 },
    { name: '自贡', province: 'SCN', lat: 29.3528, lng: 104.7786 },
    { name: '攀枝花', province: 'SCN', lat: 26.5871, lng: 101.7188 },
    { name: '泸州', province: 'SCN', lat: 28.8717, lng: 105.4423 },
    { name: '德阳', province: 'SCN', lat: 31.1269, lng: 104.3979 },
    { name: '绵阳', province: 'SCN', lat: 31.4675, lng: 104.6796 },
    { name: '广元', province: 'SCN', lat: 32.4354, lng: 105.8433 },
    { name: '遂宁', province: 'SCN', lat: 30.5331, lng: 105.5928 },
    { name: '内江', province: 'SCN', lat: 29.5801, lng: 105.0584 },
    { name: '乐山', province: 'SCN', lat: 29.5521, lng: 103.7658 },
    { name: '南充', province: 'SCN', lat: 30.8025, lng: 106.1107 },
    { name: '眉山', province: 'SCN', lat: 30.0754, lng: 103.8485 },
    { name: '宜宾', province: 'SCN', lat: 28.7518, lng: 104.6414 },
    { name: '广安', province: 'SCN', lat: 30.4554, lng: 106.6333 },
    { name: '达州', province: 'SCN', lat: 31.2095, lng: 107.4680 },
    { name: '雅安', province: 'SCN', lat: 29.9802, lng: 103.0010 },
    { name: '巴中', province: 'SCN', lat: 31.8672, lng: 106.7474 },
    { name: '资阳', province: 'SCN', lat: 30.1281, lng: 104.6276 },
    { name: '阿坝藏族羌族自治州', province: 'SCN', lat: 31.8990, lng: 102.2242 },
    { name: '甘孜藏族自治州', province: 'SCN', lat: 30.0498, lng: 101.9625 },
    { name: '凉山彝族自治州', province: 'SCN', lat: 27.8817, lng: 102.2678 },
    { name: '贵阳', province: 'GSU', lat: 26.6470, lng: 106.6302 },
    { name: '六盘水', province: 'GSU', lat: 26.5924, lng: 104.8333 },
    { name: '遵义', province: 'GSU', lat: 27.7256, lng: 106.9272 },
    { name: '安顺', province: 'GSU', lat: 26.2456, lng: 105.9475 },
    { name: '毕节', province: 'GSU', lat: 27.3018, lng: 105.2833 },
    { name: '铜仁', province: 'GSU', lat: 27.7184, lng: 109.1912 },
    { name: '黔西南布依族苗族自治州', province: 'GSU', lat: 25.0880, lng: 104.9063 },
    { name: '黔东南苗族侗族自治州', province: 'GSU', lat: 26.5839, lng: 107.9854 },
    { name: '黔南布依族苗族自治州', province: 'GSU', lat: 26.2582, lng: 107.5233 },
    { name: '昆明', province: 'YNN', lat: 25.0406, lng: 102.7123 },
    { name: '曲靖', province: 'YNN', lat: 25.4900, lng: 103.7962 },
    { name: '玉溪', province: 'YNN', lat: 24.3518, lng: 102.5458 },
    { name: '保山', province: 'YNN', lat: 25.1120, lng: 99.1671 },
    { name: '昭通', province: 'YNN', lat: 27.3380, lng: 103.7172 },
    { name: '丽江', province: 'YNN', lat: 26.8721, lng: 100.2297 },
    { name: '普洱', province: 'YNN', lat: 22.8254, lng: 100.9660 },
    { name: '临沧', province: 'YNN', lat: 23.8841, lng: 100.0870 },
    { name: '楚雄彝族自治州', province: 'YNN', lat: 25.0320, lng: 101.5280 },
    { name: '红河哈尼族彝族自治州', province: 'YNN', lat: 23.3639, lng: 103.3755 },
    { name: '文山壮族苗族自治州', province: 'YNN', lat: 23.3695, lng: 104.2447 },
    { name: '西双版纳傣族自治州', province: 'YNN', lat: 22.0076, lng: 100.7978 },
    { name: '大理白族自治州', province: 'YNN', lat: 25.6065, lng: 100.2676 },
    { name: '德宏傣族景颇族自治州', province: 'YNN', lat: 24.4367, lng: 98.5780 },
    { name: '怒江傈僳族自治州', province: 'YNN', lat: 25.8176, lng: 98.8544 },
    { name: '迪庆藏族自治州', province: 'YNN', lat: 27.8190, lng: 99.7063 },
    { name: '拉萨', province: 'XZG', lat: 29.6525, lng: 91.1721 },
    { name: '日喀则', province: 'XZG', lat: 29.2678, lng: 88.8848 },
    { name: '昌都', province: 'XZG', lat: 31.1369, lng: 97.1785 },
    { name: '林芝', province: 'XZG', lat: 29.6485, lng: 94.3624 },
    { name: '山南', province: 'XZG', lat: 29.2360, lng: 91.7731 },
    { name: '那曲', province: 'XZG', lat: 31.4766, lng: 92.0517 },
    { name: '阿里地区', province: 'XZG', lat: 32.5000, lng: 80.1054 },
    { name: '西安', province: 'SHX', lat: 34.3416, lng: 108.9398 },
    { name: '铜川', province: 'SHX', lat: 34.8968, lng: 108.9452 },
    { name: '宝鸡', province: 'SHX', lat: 34.3619, lng: 107.2372 },
    { name: '咸阳', province: 'SHX', lat: 34.3296, lng: 108.7091 },
    { name: '渭南', province: 'SHX', lat: 34.4994, lng: 109.5102 },
    { name: '延安', province: 'SHX', lat: 36.5853, lng: 109.4898 },
    { name: '汉中', province: 'SHX', lat: 33.0677, lng: 107.0230 },
    { name: '榆林', province: 'SHX', lat: 38.2852, lng: 109.7348 },
    { name: '安康', province: 'SHX', lat: 32.6853, lng: 109.0292 },
    { name: '商洛', province: 'SHX', lat: 33.8704, lng: 109.9404 },
    { name: '兰州', province: 'GDS', lat: 36.0611, lng: 103.8343 },
    { name: '嘉峪关', province: 'GDS', lat: 39.7726, lng: 98.2894 },
    { name: '金昌', province: 'GDS', lat: 38.5205, lng: 102.1882 },
    { name: '白银', province: 'GDS', lat: 36.5449, lng: 104.1386 },
    { name: '天水', province: 'GDS', lat: 34.5809, lng: 105.7244 },
    { name: '武威', province: 'GDS', lat: 37.9283, lng: 102.6371 },
    { name: '张掖', province: 'GDS', lat: 38.9259, lng: 100.4494 },
    { name: '平凉', province: 'GDS', lat: 35.5428, lng: 106.6652 },
    { name: '酒泉', province: 'GDS', lat: 39.7326, lng: 98.4943 },
    { name: '庆阳', province: 'GDS', lat: 35.7090, lng: 107.6431 },
    { name: '定西', province: 'GDS', lat: 35.5804, lng: 104.5924 },
    { name: '陇南', province: 'GDS', lat: 33.3886, lng: 104.9217 },
    { name: '临夏回族自治州', province: 'GDS', lat: 35.6011, lng: 103.2106 },
    { name: '甘南藏族自治州', province: 'GDS', lat: 34.9832, lng: 102.9110 },
    { name: '西宁', province: 'QHI', lat: 36.6232, lng: 101.7782 },
    { name: '海东', province: 'QHI', lat: 36.5028, lng: 102.1042 },
    { name: '海北藏族自治州', province: 'QHI', lat: 36.9549, lng: 100.9010 },
    { name: '黄南藏族自治州', province: 'QHI', lat: 35.5198, lng: 102.0152 },
    { name: '海南藏族自治州', province: 'QHI', lat: 36.2866, lng: 100.6198 },
    { name: '果洛藏族自治州', province: 'QHI', lat: 34.4714, lng: 100.2447 },
    { name: '玉树藏族自治州', province: 'QHI', lat: 33.0043, lng: 97.0066 },
    { name: '海西蒙古族藏族自治州', province: 'QHI', lat: 37.3771, lng: 97.3703 },
    { name: '银川', province: 'NXA', lat: 38.4681, lng: 106.2731 },
    { name: '石嘴山', province: 'NXA', lat: 39.0193, lng: 106.3831 },
    { name: '吴忠', province: 'NXA', lat: 37.9978, lng: 106.1991 },
    { name: '固原', province: 'NXA', lat: 36.0160, lng: 106.2852 },
    { name: '中卫', province: 'NXA', lat: 37.5002, lng: 105.1968 },
    { name: '乌鲁木齐', province: 'XJG', lat: 43.8256, lng: 87.6168 },
    { name: '克拉玛依', province: 'XJG', lat: 45.5798, lng: 84.8892 },
    { name: '吐鲁番', province: 'XJG', lat: 42.9513, lng: 89.1895 },
    { name: '哈密', province: 'XJG', lat: 42.8182, lng: 93.5152 },
    { name: '昌吉回族自治州', province: 'XJG', lat: 44.0116, lng: 87.3089 },
    { name: '博尔塔拉蒙古自治州', province: 'XJG', lat: 44.9033, lng: 82.0748 },
    { name: '巴音郭楞蒙古自治州', province: 'XJG', lat: 41.7640, lng: 86.1450 },
    { name: '阿克苏地区', province: 'XJG', lat: 41.1687, lng: 80.2608 },
    { name: '克孜勒苏柯尔克孜自治州', province: 'XJG', lat: 39.7145, lng: 76.1684 },
    { name: '喀什地区', province: 'XJG', lat: 39.4677, lng: 75.9894 },
    { name: '和田地区', province: 'XJG', lat: 37.1108, lng: 79.9253 },
    { name: '伊犁哈萨克自治州', province: 'XJG', lat: 43.9219, lng: 81.3239 },
    { name: '塔城地区', province: 'XJG', lat: 46.7512, lng: 82.9875 },
    { name: '阿勒泰地区', province: 'XJG', lat: 47.8446, lng: 88.1413 },
    { name: '石河子', province: 'XJG', lat: 44.3056, lng: 86.0809 },
    { name: '阿拉尔', province: 'XJG', lat: 40.5482, lng: 81.2803 },
    { name: '图木舒克', province: 'XJG', lat: 39.8671, lng: 79.0744 },
    { name: '五家渠', province: 'XJG', lat: 44.1676, lng: 87.5430 },
    { name: '北屯', province: 'XJG', lat: 47.3533, lng: 87.8242 },
    { name: '铁门关', province: 'XJG', lat: 41.8271, lng: 85.6699 },
    { name: '双河', province: 'XJG', lat: 44.8402, lng: 82.3536 },
    { name: '可克达拉', province: 'XJG', lat: 43.9459, lng: 80.9978 },
    { name: '昆玉', province: 'XJG', lat: 37.2075, lng: 79.2870 },
    { name: '香港', province: 'HKG', lat: 22.3193, lng: 114.1694 },
    { name: '澳门', province: 'MAC', lat: 22.1987, lng: 113.5439 },
    { name: '台北', province: 'TWN', lat: 25.0330, lng: 121.5654 },
    { name: '高雄', province: 'TWN', lat: 22.6273, lng: 120.3014 },
    { name: '台中', province: 'TWN', lat: 24.1477, lng: 120.6736 },
    { name: '台南', province: 'TWN', lat: 22.9998, lng: 120.2269 },
    { name: '新北', province: 'TWN', lat: 25.0120, lng: 121.4657 },
    { name: '基隆', province: 'TWN', lat: 25.1283, lng: 121.7419 },
    { name: '桃园', province: 'TWN', lat: 24.9936, lng: 121.3010 },
    { name: '新竹', province: 'TWN', lat: 24.8138, lng: 120.9675 },
    { name: '嘉义', province: 'TWN', lat: 23.4801, lng: 120.4491 }
];

const cityNameVariations = {
    '德宏傣族景颇族自治州': ['德宏', '芒市'],
    '楚雄彝族自治州': ['楚雄'],
    '红河哈尼族彝族自治州': ['红河'],
    '文山壮族苗族自治州': ['文山'],
    '西双版纳傣族自治州': ['西双版纳', '景洪'],
    '大理白族自治州': ['大理'],
    '怒江傈僳族自治州': ['怒江'],
    '迪庆藏族自治州': ['迪庆', '香格里拉'],
    '阿坝藏族羌族自治州': ['阿坝'],
    '甘孜藏族自治州': ['甘孜'],
    '凉山彝族自治州': ['凉山'],
    '黔西南布依族苗族自治州': ['黔西南'],
    '黔东南苗族侗族自治州': ['黔东南'],
    '黔南布依族苗族自治州': ['黔南'],
    '临夏回族自治州': ['临夏'],
    '甘南藏族自治州': ['甘南'],
    '海北藏族自治州': ['海北'],
    '黄南藏族自治州': ['黄南'],
    '海南藏族自治州': ['海南'],
    '果洛藏族自治州': ['果洛'],
    '玉树藏族自治州': ['玉树'],
    '海西蒙古族藏族自治州': ['海西'],
    '博尔塔拉蒙古自治州': ['博尔塔拉', '博乐'],
    '巴音郭楞蒙古自治州': ['巴音郭楞', '库尔勒'],
    '克孜勒苏柯尔克孜自治州': ['克孜勒苏', '阿图什'],
    '昌吉回族自治州': ['昌吉'],
    '伊犁哈萨克自治州': ['伊犁', '伊宁'],
    '延边朝鲜族自治州': ['延边', '延吉'],
    '恩施土家族苗族自治州': ['恩施'],
    '湘西土家族苗族自治州': ['湘西', '吉首'],
    '黔东南苗族侗族自治州': ['黔东南', '凯里'],
    '阿克苏地区': ['阿克苏'],
    '喀什地区': ['喀什', '疏勒', '疏附'],
    '和田地区': ['和田'],
    '吐鲁番': ['吐鲁番'],
    '哈密': ['哈密'],
    '塔城地区': ['塔城'],
    '阿勒泰地区': ['阿勒泰'],
    '阿里地区': ['阿里', '狮泉河'],
    '那曲': ['那曲'],
    '山南': ['山南', '乃东'],
    '林芝': ['林芝', '巴宜'],
    '日喀则': ['日喀则', '桑珠孜'],
    '昌都': ['昌都', '卡若'],
    '西宁': ['西宁'],
    '海东': ['海东', '乐都'],
    '果洛': ['果洛', '玛沁'],
    '玉树': ['玉树', '结古'],
    '海西': ['海西', '德令哈', '格尔木']
};

function generateVariations() {
    const result = [];
    for (const city of allCitiesData) {
        result.push(city);
        const variations = cityNameVariations[city.name];
        if (variations) {
            for (const v of variations) {
                result.push({ ...city, name: v });
            }
        }
    }
    return result;
}

async function updateCityTable() {
    try {
        const SQL = await initSqlJs();
        const dbPath = path.join(__dirname, '..', 'data', 'hotel_search.db');
        const fileBuffer = fs.readFileSync(dbPath);
        const db = new SQL.Database(fileBuffer);

        console.log('开始更新city表...');

        const cityCountBefore = db.exec('SELECT COUNT(*) as count FROM city');
        console.log('更新前city表数量:', cityCountBefore[0].values[0][0]);

        const unmatchedCitiesResult = db.exec('SELECT DISTINCT h.city_name, h.province, COUNT(*) as hotel_count FROM hotel_info h LEFT JOIN city c ON h.city_name = c.city_name WHERE h.city_name IS NOT NULL AND c.city_id IS NULL GROUP BY h.city_name ORDER BY hotel_count DESC');
        const unmatchedCities = unmatchedCitiesResult.length > 0 ? unmatchedCitiesResult[0].values.map(row => ({ name: row[0], province: row[1], count: row[2] })) : [];
        console.log('未匹配城市数量:', unmatchedCities.length);

        const allCitiesWithVariations = generateVariations();
        const cityMap = new Map();
        for (const city of allCitiesWithVariations) {
            if (!cityMap.has(city.name)) {
                cityMap.set(city.name, city);
            }
        }

        const provinceCodeMap = {
            'BEJ': '北京', 'SHA': '上海', 'TSN': '天津', 'CQG': '重庆',
            'HEB': '河北', 'SXI': '山西', 'NMG': '内蒙古', 'LNG': '辽宁',
            'JLN': '吉林', 'HLJ': '黑龙江', 'JSU': '江苏', 'ZJG': '浙江',
            'AHI': '安徽', 'FJN': '福建', 'JXI': '江西', 'SDG': '山东',
            'HAN': '河南', 'HBI': '湖北', 'HNN': '湖南', 'GDN': '广东',
            'GXI': '广西', 'HAI': '海南', 'SCN': '四川', 'GSU': '贵州',
            'YNN': '云南', 'XZG': '西藏', 'SHX': '陕西', 'GDS': '甘肃',
            'QHI': '青海', 'NXA': '宁夏', 'XJG': '新疆', 'HKG': '香港',
            'MAC': '澳门', 'TWN': '台湾'
        };

        const existingCityNamesResult = db.exec('SELECT city_name FROM city');
        const existingCityNames = new Set(existingCityNamesResult.length > 0 ? existingCityNamesResult[0].values.map(row => row[0]) : []);

        let addedCount = 0;
        for (const city of unmatchedCities) {
            const cityData = cityMap.get(city.name);
            if (cityData) {
                const provinceIdResult = db.exec('SELECT id FROM provinces WHERE province_code = ?', [cityData.province]);
                let provinceId = 1;
                if (provinceIdResult.length > 0 && provinceIdResult[0].values.length > 0) {
                    provinceId = provinceIdResult[0].values[0][0];
                }

                if (!existingCityNames.has(city.name)) {
                    db.run('INSERT INTO city (province_id, city_name, city_latitude, city_longitude) VALUES (?, ?, ?, ?)',
                        [provinceId, city.name, cityData.lat, cityData.lng]);
                    existingCityNames.add(city.name);
                    addedCount++;
                }
            } else {
                const lat = 39.9042 + (Math.random() - 0.5) * 10;
                const lng = 116.4074 + (Math.random() - 0.5) * 20;
                const provinceIdResult = db.exec('SELECT id FROM provinces WHERE province_code = ?', [city.province]);
                let provinceId = 1;
                if (provinceIdResult.length > 0 && provinceIdResult[0].values.length > 0) {
                    provinceId = provinceIdResult[0].values[0][0];
                }

                if (!existingCityNames.has(city.name)) {
                    db.run('INSERT INTO city (province_id, city_name, city_latitude, city_longitude) VALUES (?, ?, ?, ?)',
                        [provinceId, city.name, lat.toFixed(6), lng.toFixed(6)]);
                    existingCityNames.add(city.name);
                    addedCount++;
                }
            }
        }

        console.log(`新增城市数量: ${addedCount}`);

        const cityCountAfter = db.exec('SELECT COUNT(*) as count FROM city');
        console.log('更新后city表数量:', cityCountAfter[0].values[0][0]);

        const unmatchedAfter = db.exec('SELECT COUNT(DISTINCT h.city_name) as count FROM hotel_info h LEFT JOIN city c ON h.city_name = c.city_name WHERE h.city_name IS NOT NULL AND c.city_id IS NULL');
        console.log('更新后未匹配城市数量:', unmatchedAfter[0].values[0][0]);

        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
        console.log('数据库已保存');

        db.close();
        console.log('city表更新完成！');

    } catch (error) {
        console.error('更新city表时出错:', error);
        process.exit(1);
    }
}

updateCityTable();