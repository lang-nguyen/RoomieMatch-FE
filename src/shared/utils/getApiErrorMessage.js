export const getApiErrorMessage = (error, fallback = 'Đã có lỗi xảy ra') => {
  if (!error) return fallback;

  const payload = error.data;

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (payload?.message && typeof payload.message === 'string') {
    return payload.message;
  }

  if (payload?.detail) {
    if (typeof payload.detail === 'string') {
      return payload.detail;
    }

    // FastAPI validation errors often come as an array in `detail`.
    if (Array.isArray(payload.detail) && payload.detail.length > 0) {
      const firstDetail = payload.detail[0];

      if (typeof firstDetail === 'string') {
        return firstDetail;
      }

      if (firstDetail?.msg) {
        return firstDetail.msg;
      }
    }
  }

  if (error.error && typeof error.error === 'string') {
    return error.error;
  }

  return fallback;
};