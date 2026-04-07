declare module "sweetalert" {
  type SweetAlertIcon = "warning" | "error" | "success" | "info" | "question"

  interface SweetAlertOptions {
    title?: string
    text?: string
    icon?: SweetAlertIcon
    buttons?: boolean | string | string[]
    dangerMode?: boolean
    timer?: number
  }

  function swal(options: SweetAlertOptions): Promise<boolean>
  export default swal
}
