package good.stuff.backend.common.dto.product;


import good.stuff.backend.common.dto.category.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int quantity;
    private Double averageRating;
    private int totalRatings;
    private CategoryDto category;
    private List<ProductImageDto> images;
}
