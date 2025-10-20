
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import swal from 'sweetalert2';
import { HttpClient, HttpParams, HttpXhrBackend, HttpResponse } from '@angular/common/http';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { parse } from "content-disposition-attachment";
import { Capacitor } from '@capacitor/core';
import { FormControl } from '@angular/forms';


export function preventNonNumericPaste(event: ClipboardEvent): void {
	const clipboardData = event.clipboardData || (window as any).clipboardData;
	const pastedData = clipboardData.getData('text');

	if (!/^\d+$/.test(pastedData)) {
		event.preventDefault();
	}
}


export async function showPreconfirmMessage(
	title: string,
	html: string,
	icon: string = "warning",
	cancelButtonText: string = "Cancelar",
	confirmButtonText: string = "Eliminar",
): Promise<SweetAlertResult> {
	const swalOptions = {
		title: title,
		html: html,
		icon: icon,
		showCancelButton: true,
		confirmButtonColor: "#d33",
		cancelButtonColor: "#3085d6",
		cancelButtonText: cancelButtonText,
		confirmButtonText: confirmButtonText,
		heightAuto: false,
		showClass: {
			popup: 'animate__animated animate__fadeInDown animate__faster'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp animate__faster'
		}
	} as SweetAlertOptions;

	return await swal.fire(swalOptions);
}


export async function delayExecution(time: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, time));
}

export function showAction(permissions) {
	for (let i = 0; i < permissions.length; i++) {
		if (!permissions[i]) {
			return false;
		}
	}

	return true;
}

export function generateRandomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}


export function validateInput(event) {
	const value = event.target.value;
	event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
}


export async function downloadAndroidFile(http: HttpClient, url: string): Promise<any> {
	try {


		let permission = await Filesystem.checkPermissions()

		if (permission.publicStorage !== "granted") {

			permission = await Filesystem.requestPermissions()

			if (permission.publicStorage !== "granted") {
				return
			}
		}

		const response: HttpResponse<Blob> = await http.get(`${url}`, { responseType: 'blob', observe: 'response' }).toPromise();
		const filename = getFileName(response);

		if (filename) {
			await convertBlobToBase64(response.body, filename);
		} else {
			console.error('Filename not found in headers.');
		}

	} catch (error) {
		console.log(error);
	}

}


function convertBlobToBase64(blob: Blob, filename: string) {
	return new Promise<void>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = async () => {
			const base64data = reader.result.toString();
			try {
				await saveBase64(filename, base64data);
				resolve();
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = reject;
	});
}


async function saveBase64(filename: string, base64: string) {



	try {
		await Filesystem.writeFile({
			path: filename,
			data: base64,
			directory: Directory.Documents,
			recursive: true
		});
		const uriResult = await Filesystem.getUri({
			path: filename,
			directory: Directory.Documents
		});
		openFile(uriResult.uri);
	} catch (error) {
		console.error('Error saving the file:', error);
		throw error;
	}
}

function getFileName(response: HttpResponse<Blob>): string {
	const contentDisposition = response.headers.get('content-disposition');
	const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');

	if (contentDisposition) {
		const matches = /filename=([^;]+)/.exec(contentDisposition);
		if (matches && matches[1]) {
			return currentDate + '-' + matches[1].trim();
		}
	}
	return currentDate + 'document.pdf';
}

function openFile(uri: string) {
        try {
                const fileSrc = Capacitor.convertFileSrc(uri);
                window.open(fileSrc, '_blank');
        } catch (error) {
                console.error('Error opening file', error);
        }
}
