class BusinessSerializer < ActiveModel::Serializer
  attributes :id, :name, :images, :reviews

  def url
    if object.image.attached?
      {
        url: rails_blob_url(object.image)
      }
    end
  end

  def images
    @images = Image.where(business_id: object.id)
    return @images
  end

end
