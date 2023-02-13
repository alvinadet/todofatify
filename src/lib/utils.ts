export interface ResponseStatusMessageDto {
  status: string
  message: string
}

export interface ResponseSuccessDto<T> extends ResponseStatusMessageDto {
  data: T
}

export function responseSuccess<T>(data: any): ResponseSuccessDto<T> {
  return { data, message: "Success", status: "Success" }
}
