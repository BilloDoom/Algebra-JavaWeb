package good.stuff.webstore.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryDTO {
    private Long id;
    private String name;
    private List<String> imageUrls;
    private List<ProductDTO> products;
}
