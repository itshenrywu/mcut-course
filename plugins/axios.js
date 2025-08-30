export default function ({ $axios, app }) {
	$axios.defaults.timeout = 10000;
	$axios.interceptors.request.use(config => {
		config.timeout = 10000;
		return config;
	});

	$axios.onError(error => {
		app.$swal({
			icon: 'error',
			title: '載入失敗，請稍後再試',
			html: '若持續發生，請填寫回報並附上以下資訊，謝謝！<br><br><div class="ts-box"><div class="ts-content"><div class="ts-text is-small is-start-aligned" style="font-family:monospace">e: ' + JSON.stringify(error) + '<br>u: ' + localStorage.uid + '<br>d: ' + (navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform) + '<br>b: ' + (navigator.userAgentData ? navigator.userAgentData.brands.map(brand => brand.brand + ' ' + brand.version).join(', ') : navigator.userAgent) + '</div></div></div>',
			confirmButtonText: '重新整理',
			cancelButtonText: '回報問題',
			showCancelButton: true,
			allowOutsideClick: false,
			allowEscapeKey: false
		}).then((res) => {
			if (res.isConfirmed) {
				location.reload();
			} else {
				window.open('https://forms.gle/LrykpuGU9AL92svA6?openExternalBrowser=1');
			}
		});
		return Promise.reject(error);
	});
} 