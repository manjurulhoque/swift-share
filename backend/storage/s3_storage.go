package storage

import (
	"bytes"
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	s3types "github.com/aws/aws-sdk-go-v2/service/s3/types"
	appConfig "github.com/manjurulhoque/swift-share/backend/config"
)

type s3Storage struct {
    bucket string
    client *s3.Client
}

// NewS3Storage builds an AWS S3 backed StorageService.
func NewS3Storage(cfg appConfig.StorageConfig) (StorageService, error) {
    var awsCfg aws.Config
    var err error

    if cfg.S3AccessKey != "" && cfg.S3SecretKey != "" {
        awsCfg, err = config.LoadDefaultConfig(context.TODO(),
            config.WithRegion(cfg.S3Region),
            config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(cfg.S3AccessKey, cfg.S3SecretKey, "")),
        )
    } else {
        awsCfg, err = config.LoadDefaultConfig(context.TODO(), config.WithRegion(cfg.S3Region))
    }
    if err != nil {
        return nil, err
    }

    if cfg.S3Endpoint != "" {
        awsCfg.BaseEndpoint = aws.String(cfg.S3Endpoint)
    }

    client := s3.NewFromConfig(awsCfg)
    return &s3Storage{bucket: cfg.S3Bucket, client: client}, nil
}

func (s *s3Storage) UploadFile(ctx context.Context, key string, data []byte, contentType string) (string, error) {
    _, err := s.client.PutObject(ctx, &s3.PutObjectInput{
        Bucket:      aws.String(s.bucket),
        Key:         aws.String(key),
        Body:        bytes.NewReader(data),
        ContentType: aws.String(contentType),
        ACL:         s3types.ObjectCannedACLPrivate,
    })
    if err != nil {
        return "", err
    }
    url := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.bucket, appConfig.AppConfig.Storage.S3Region, key)
    return url, nil
}

func (s *s3Storage) DeleteFile(ctx context.Context, key string) error {
    _, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
        Bucket: aws.String(s.bucket),
        Key:    aws.String(key),
    })
    return err
}
