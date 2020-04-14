<template>
	<view>
		<view class="header">
			<view @tap="handleSelect(index)" class="target" v-for="(target, index) in filterByList" :key="index" :class="{ on: target.selected }">{{ target.text }}</view>
		</view>
		<!-- 占位 tabbar 有定位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" @tap="handleGoods(goods)" v-for="goods in goodsList" :key="goods.goods_id">
					<image mode="widthFix" :src="goods.img"></image>
					<view class="name">{{ goods.name }}}</view>
					<view class="info">
						<view class="price">
							<text>￥</text>
							{{ goods.price }}
						</view>
						<view class="slogan">
							{{ goods.slogan }}
							<text>人付款</text>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
	</view>
</template>

<script>
import interfaces from '../../utils/interfaces.js';

export default {
	data() {
		return {
			filterByList: [{ text: '全部', selected: true, filterby: 'all' }, { text: '口碑', selected: false, filterby: 'public' }, { text: '热门', selected: false, filterby: 'hot' }],
			filterby: 'all',
			page: 1,
			size: 6,
			loadingText: '正在加载中...',
			goodsList: []
		};
	},
	onLoad(option) {
		// console.log(option.name)
		//动态修改nav title
		uni.setNavigationBarTitle({
			title: option.name
		});
		this.initData();
	},
	onPullDownRefresh() {
		setTimeout(() => {
			this.init();
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		this.page++;
		this.initData();
	},
	methods: {
		init() {
			this.page = 1;
			this.loadingText = '加载中...';
			this.goodsList = [];
			this.initData();
		},
		initData() {
			this.request({
				url: `${interfaces.getGoodsList}/${this.filterby}/${this.page}/${this.size}`,
				success: res => {
					// console.log(res);
					// this.goodsList = res.data;
					if (res.data.length > 0) {
						res.data.forEach(item => {
							this.goodsList.push(item);
						});
					} else {
						this.loadingText = '到底了';
					}
				}
			});
		},
		handleSelect(index) {
			this.filterByList[index].selected = true;
			// 其他的selected false
			for (let i = 0; i < this.filterByList.length; i++) {
				if (i != index) {
					this.filterByList[i].selected = false;
				}
			}

			//请求数据
			this.filterby = this.filterByList[index].filterby;
			this.init();
		},
		handleGoods(goods) {
			// 页面跳转 商品详情
			uni.navigateTo({
				url: './goods?goodsInfo=' + JSON.stringify(goods)
			});
		}
	}
};
</script>
<style lang="scss">
.header {
	width: 92%;
	padding: 0 4%;
	height: 79rpx;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	position: fixed;
	z-index: 10;
	background-color: #fff;
	border-bottom: solid 1rpx #eee;

	.target {
		width: 20%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		margin-bottom: -2rpx;
		color: #aaa;

		&.on {
			color: #555;
			border-bottom: 4rpx solid #f06c7a;
			font-weight: 600;
			font-size: 30rpx;
		}

		.icon {
			font-size: 26rpx;
		}
	}
}

.place {
	background-color: #ffffff;
	height: 100rpx;
}

.goods-list {
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60rpx;
		color: #979797;
		font-size: 24rpx;
	}

	.product-list {
		width: 92%;
		padding: 0 4% 3vw 4%;
		column-count: 2;
		column-gap: 1em;

		.product {
			break-inside: avoid;
			border-radius: 20rpx;
			background-color: #fff;
			margin: 0 0 15rpx 0;
			box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);

			image {
				width: 100%;
				border-radius: 20rpx 20rpx 0 0;
			}

			.name {
				width: 92%;
				padding: 6rpx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 30rpx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10rpx 4% 10rpx 4%;

				.price {
					color: #e65339;
					font-size: 30rpx;
					font-weight: 600;
				}

				.slogan {
					color: #807c87;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
