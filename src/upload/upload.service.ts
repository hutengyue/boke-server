import { Injectable } from '@nestjs/common';
const OSS = require('ali-oss');
const { STS } = require('ali-oss');
const { getCredential } = require('ali-oss/lib/common/signUtils');
const { getStandardRegion } = require('ali-oss/lib/common/utils/getStandardRegion');
const { policy2Str } = require('ali-oss/lib/common/utils/policy2Str');

@Injectable()
export class UploadService {
    private client: any;

    constructor() {

    }

    GenerateSignature = async () => {
        // 初始化STS客户端
        let sts = new STS({
            accessKeyId: 'LTAI5tQKoFE352QRY5tPLgXY', 
            accessKeySecret: 'lsQluN55yMzZhGFMZ4UdTvZJm6yepy'
        });
    
        // 调用assumeRole接口获取STS临时访问凭证
        const result = await sts.assumeRole('acs:ram::1030379817846753:role/alioss', '', '3600', 'yourRoleSessionName'); // 从环境变量中获取RAM角色ARN，并设置临时访问凭证有效期为3600秒，角色会话名称为yourRoleSessionName可自定义
    
        // 提取临时访问凭证中的AccessKeyId、AccessKeySecret和SecurityToken
        const accessKeyId = result.credentials.AccessKeyId;
        const accessKeySecret = result.credentials.AccessKeySecret;
        const securityToken = result.credentials.SecurityToken;
    
        // 初始化OSS Client
        const client = new OSS({
            bucket: 'cavalryy', // 请替换为目标Bucket名称
            region: 'oss-cn-hangzhou', // 请替换为标Bucket所在地域
            accessKeyId,
            accessKeySecret,
            stsToken: securityToken,
            refreshSTSTokenInterval: 0,
            refreshSTSToken: async () => {
                const { accessKeyId, accessKeySecret, securityToken } = await client.getCredential();
                return { accessKeyId, accessKeySecret, stsToken: securityToken };
            },
        });
    
        // 创建表单数据Map
        const formData = new Map();
    
        // 设置签名过期时间为当前时间往后推10分钟 
        const date = new Date();
        const expirationDate = new Date(date);
        expirationDate.setMinutes(date.getMinutes() + 10);
    
        // 格式化日期为符合ISO 8601标准的UTC时间字符串格式
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }
        function formatDateToUTC(date) {
            return (
                date.getUTCFullYear() +
                padTo2Digits(date.getUTCMonth() + 1) +
                padTo2Digits(date.getUTCDate()) +
                'T' +
                padTo2Digits(date.getUTCHours()) +
                padTo2Digits(date.getUTCMinutes()) +
                padTo2Digits(date.getUTCSeconds()) +
                'Z'
            );
        }
        const formattedDate = formatDateToUTC(expirationDate);
    
        // 生成x-oss-credential并设置表单数据
        const credential = getCredential(formattedDate.split('T')[0], getStandardRegion(client.options.region), client.options.accessKeyId);
        formData.set('x_oss_date', formattedDate);
        formData.set('x_oss_credential', credential);
        formData.set('x_oss_signature_version', 'OSS4-HMAC-SHA256');
    
        // 创建policy
        // 示例policy表单域只列举必填字段
        const policy = {
            expiration: expirationDate.toISOString(),
            conditions: [
                { 'bucket': 'examplebucket'}, 
                { 'x-oss-credential': credential },
                { 'x-oss-signature-version': 'OSS4-HMAC-SHA256' },
                { 'x-oss-date': formattedDate },
            ],
        };
    
        // 如果存在STS Token，添加到策略和表单数据中
        if (client.options.stsToken) {
            policy.conditions.push({ 'x-oss-security-token': client.options.stsToken } as any);
            formData.set('security_token', client.options.stsToken);
        }
    
        // 生成签名并设置表单数据
        const signature = client.signPostObjectPolicyV4(policy, date);
        formData.set('policy', Buffer.from(policy2Str(policy), 'utf8').toString('base64'));
        formData.set('signature', signature);
    
        // 返回表单数据
        return {
            host: `http://${client.options.bucket}.oss-${client.options.region}.aliyuncs.com`, 
            policy: Buffer.from(policy2Str(policy), 'utf8').toString('base64'),
            x_oss_signature_version: 'OSS4-HMAC-SHA256',
            x_oss_credential: credential,
            x_oss_date: formattedDate,
            signature: signature,
            dir: 'user-dir', // 指定上传到OSS的文件前缀
            endpoint:'file.cavalry.xin',//自定义域名
            security_token: client.options.stsToken,
            bucket: client.options.bucket, // 目标Bucket名称
            region: client.options.region, // 目标Bucket所在地域
            accessKeyId: accessKeyId, // 添加accessKeyId
            // 注意：不建议返回accessKeySecret，这里为了满足需求保留，实际使用请谨慎
            accessKeySecret: accessKeySecret 
        };
    };
}
