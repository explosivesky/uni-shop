export default {
	updateNavbarBadge(count) {
		if (count > 0) {
			//设置 tabbar 角标数量
			uni.setTabBarBadge({
				index: 2, //第几个的tabbar按钮
				text: count.toString() //注意必须是 string 类型
			})
		} else {
			//隐藏角标
			uni.removeTabBarBadge({
				index: 2, //第几个的tabbar按钮
			})
		}
	},
	// 判断订单状态
	formatStatus(order) {
		if (!order) {
			return ''
		}
		// 未支付
		if (!order.paid_time) {
			return "待支付"
		}
		// 退款情况
		if (order.refund_status !== 'pending') {
			switch (order.refund_status) {
				case 'applied':
					return '退款中'
					break;
				case 'success':
					return '退款成功'
					break;
				case 'failed':
					return '退款失败'
					break;
			}
		}
		switch (order.ship_status) {
			case 'pending':
				return '待发货'
				break;
			case 'delivered':
				return '待收货'
				break;
			case 'received':
				return '已签收'
				break;
		}
	},
}
