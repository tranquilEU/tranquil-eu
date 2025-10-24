export const useToken = () => {
	const token = localStorage.getItem('accessToken');
	return { token };
};
