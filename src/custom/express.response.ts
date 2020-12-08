import { Response } from 'express'

/*
 * With this piece of code we ca personalize the attributes of the response,
 * in case we need it.
 */

interface CustomResponse extends Response {
  newValue?: string
}

export { CustomResponse as Response }
