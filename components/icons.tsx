import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CloudUpload,
  Code,
  Copy,
  File,
  Image,
  Loader,
  Loader2,
  LucideProps,
  Text,
} from "lucide-react";

export const Icons = {
  text: Text,
  image: Image,
  spinner: Loader2,
  throbber: Loader,
  cloudUpload: CloudUpload,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  copy: Copy,
  check: Check,
  file: File,
  arrowLeft: ArrowLeft,
  code: Code,
  cortexIcon: (props: LucideProps) => (
    <svg
      width="72"
      height="80"
      viewBox="0 0 72 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.4928 9.95354C48.8986 7.5822 43.7011 6.09465 38.8714 6.15566L38.8524 6.1559H38.8333C20.8138 6.1559 6.09475 21.2448 6.09475 39.9981C6.09475 58.7513 20.8138 73.8402 38.8333 73.8402H38.8623L38.8912 73.8407C49.1951 74.0386 59.02 68.8017 64.7987 60.8413C65.794 59.4703 66.089 57.8377 65.8025 55.8846C65.5076 53.874 64.6099 51.6901 63.4179 49.5746C62.4056 47.7777 61.2465 46.1445 60.244 44.8581C59.1168 46.2389 57.6256 47.9591 55.8755 49.7243C51.9856 53.6476 46.2612 58.3724 40.0914 59.3211C28.3551 61.1257 17.8218 51.9392 18.1204 39.9209C18.4091 28.3039 28.4833 19.4404 40.1181 21.3362C45.9809 22.2915 51.6881 26.8036 55.6224 30.5409C57.4044 32.2337 58.9381 33.8815 60.1008 35.2003C61.041 33.9326 62.1201 32.3179 63.0488 30.5226C65.3338 26.1051 66.1645 21.7303 63.8522 18.3872C61.8286 15.4614 58.1089 12.3362 53.4928 9.95354ZM64.1588 39.9614C64.2502 39.8457 64.3438 39.7258 64.4395 39.602C65.6203 38.0739 67.1422 35.902 68.4511 33.3715C70.9574 28.5262 73.2418 21.2147 68.849 14.8637C66.1014 10.8912 61.4986 7.1745 56.267 4.47415C51.0191 1.76537 44.8511 -0.0701468 38.8144 0.00205663C17.3146 0.0125864 -9.68735e-07 17.9781 0 39.9981C9.68735e-07 62.0146 17.3092 79.9779 38.8043 79.994C51.1567 80.2211 62.8149 73.9835 69.7144 64.4793C71.8901 61.4822 72.2885 58.098 71.8315 54.983C71.383 51.9254 70.1003 48.9897 68.7155 46.5317C67.3168 44.0492 65.7206 41.8912 64.4892 40.3662C64.3761 40.2262 64.2659 40.0912 64.1588 39.9614ZM56.2333 40.0807C56.1565 39.9909 56.077 39.8984 55.9949 39.8034C54.8827 38.5167 53.3062 36.7899 51.4461 35.0229C47.5749 31.3455 43.0382 28.0455 39.1472 27.4115C31.2743 26.1287 24.4123 32.0637 24.2132 40.0752C24.0115 48.195 31.1195 54.4758 39.1739 53.2374C43.2582 52.6093 47.7777 49.1936 51.5682 45.3705C53.3911 43.5319 54.9172 41.732 55.9882 40.3899C56.0729 40.2838 56.1546 40.1806 56.2333 40.0807Z"
        fill="currentColor"
      />
    </svg>
  ),
};
