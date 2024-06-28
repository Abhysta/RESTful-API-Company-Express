export const validates = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: true,
  });

  if (result.error) {
    throw new Error(result.error.message, 404);
  } else {
    return result.value;
  }
};
