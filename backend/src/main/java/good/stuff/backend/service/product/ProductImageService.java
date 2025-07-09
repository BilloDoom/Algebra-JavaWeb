package good.stuff.backend.service.product;

import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.product.ProductImage;
import good.stuff.backend.repository.product.ProductImageRepository;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.service.BackblazeB2Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final BackblazeB2Service backblazeB2Service;

    public ProductImageService(ProductImageRepository productImageRepository,
                               ProductRepository productRepository,
                               BackblazeB2Service backblazeB2Service) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
        this.backblazeB2Service = backblazeB2Service;
    }

    public ProductImage uploadImage(Long productId, MultipartFile file) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        try {
            String imageUrl = null;//backblazeB2Service.uploadFile(file);

            ProductImage image = new ProductImage();
            image.setImageUrl(imageUrl);
            image.setProduct(product);

            return productImageRepository.save(image);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public List<ProductImage> getImagesByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return product.getImages();
    }

    public void deleteImage(Long imageId) {
        productImageRepository.deleteById(imageId);
    }
}
